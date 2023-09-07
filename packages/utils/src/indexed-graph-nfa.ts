import type { NFA, NFAIterator, NFAIteratorResult, TokenMatcher } from '@matchkit/types';

import type { IndexedGraph } from './indexed-graph';
import { DoubleBuffer } from './double-buffer';

/**
 * Nondeterministic Finite Automaton (NFA) that performs an allocation-free traversal of the provided graph starting from the given roots
 *
 * Rather than branching, the NFA can occupy multiple states simultaneously.
 * This means that memory allocation for the NFA state scales linearly with respect to the number of nodes in the control flow graph, and is unrelated to input size.
 *
 * The upside of this approach is that memory usage will remain constant for arbitrary input size, the downside is that individual branches of computation cannot carry over contextual state from previous states (which rules out e.g. backreferences when matching regular expressions).
 *
 * For this reason, the overall NFA state at any point is a simple boolean that represents whether the NFA is in a 'success' state, although this could in theory be parameterized to any value that can be coalesced across all currently-active status
 * @param T Input token type
 * @see https://swtch.com/~rsc/regexp/regexp1.html
 */
export class IndexedGraphNFA<T> implements NFA<T, boolean> {
  private pattern: IndexedGraph<TokenMatcher<T>, boolean>;
  private roots: Array<number>;

  /**
   * @param T Input token type
   * @param pattern Control flow graph representing valid state transitions, where the graph's nodes represent all the valid states for the NFA, the node values represent whether that state represents a valid overall 'success' state for the NFA, and the edge values are predicates that determine whether the edge represents a valid transition for the given input token
   * @param roots Set of initially-active starting states
   */
  public constructor(pattern: IndexedGraph<TokenMatcher<T>, boolean>, roots: Iterable<number>) {
    this.pattern = pattern;
    this.roots = Array.from(roots);
  }

  public [Symbol.iterator](): NFAIterator<T, boolean> {
    return new IndexedGraphNFAIterator<T>(this.pattern, this.roots);
  }
}

/**
 * Stateful {@link IndexedGraphNFA} instance
 * @param T Input token type
 */
class IndexedGraphNFAIterator<T> implements NFAIterator<T, boolean> {
  /**
   * Control Flow Graph for the automaton, whose edge values are predicate functions that represent whether the edge is
   * traversible for a given input token, and whose vertex values represent whether the node is a valid end state
   */
  private pattern: IndexedGraph<TokenMatcher<T>, boolean>;
  /**
   * Internal state for the automaton, representing which graph nodes are currently-active states
   */
  private state: DoubleBuffer<Array<boolean>>;
  /**
   * Overall current value for the automaton, representing whether any currently-active states are valid end states
   */
  private result: { value: boolean; done: boolean };

  /**
   * @param T Input token type
   * @param pattern Control Flow Graph for the automaton, whose edge values are predicate functions that represent whether the edge is traversible for a given input token, and whose vertex values represent whether the node is a valid end state
   * @param roots List of initially-active node indices
   */
  public constructor(pattern: IndexedGraph<TokenMatcher<T>, boolean>, roots: Iterable<number>) {
    this.pattern = pattern;
    // Initialize the internal state with no currently-active roots
    const state = Array.from({ length: pattern.getNumNodes() }, (_, index) => false);
    const nextState = state.slice();
    this.state = new DoubleBuffer(state, nextState);
    // Initialize a mutable object to use as the current overall automaton state value
    // (this is instantiated here to avoid any allocations during state transitions)
    this.result = { value: false, done: false };
    // Update the initial state, marking each of the provided root nodes as active states
    let numActiveThreads = 0;
    for (const root of roots) {
      // Mark the state as active
      state[root] = true;
      // Keep track of the number of active states
      numActiveThreads++;
      // If the node is an end state, reflect this in the overall automaton state value
      const isMatch = this.pattern.getNodeValue(root) === true;
      if (isMatch) this.result.value = true;
    }
    // If there were no roots provided, the automaton has completed
    this.result.done = numActiveThreads === 0;
  }

  public current(): boolean {
    return this.result.value;
  }

  public done(): boolean {
    return this.result.done;
  }

  public next(token: T): NFAIteratorResult<boolean> {
    if (this.result.done) return this.result;
    // Swap the state buffers
    const previousState = this.state.current();
    const updatedState = this.state.swap();
    // Clear the newly-active state buffer and overall state transition result
    updatedState.fill(false);
    this.result.value = false;
    // Iterate over the previously-active nodes, traversing any edges that are valid for the given input token
    let numActiveThreads = 0;
    for (let index = 0; index < previousState.length; index++) {
      // Skip over any nodes that are not present in the set of previously-active nodes
      const isActive = previousState[index];
      if (!isActive) continue;
      // Iterate over the set of edges
      for (const [nextIndex, predicate] of this.pattern.getNodeEdges(index)) {
        // Skip over any edges that are not traversible for the given input token
        if (!predicate(token)) continue;
        // Mark the target node as active in the updated automaton state
        updatedState[nextIndex] = true;
        // Keep track of the number of active states
        numActiveThreads++;
        // If the node is an end state, reflect this in the overall automaton state value
        const isMatch = this.pattern.getNodeValue(nextIndex) === true;
        if (isMatch) this.result.value = true;
      }
    }
    // If there are no remaining active nodes, the automaton has completed
    this.result.done = numActiveThreads === 0;
    // Return the overall automaton state value
    return this.result;
  }
}
