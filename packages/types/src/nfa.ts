/**
 * Nondeterministic Finite Automaton (NFA) base type
 *
 * Once instantiated, the NFA takes a series of input tokens that determines the sequence of state transitions.
 * @param T Input token type
 * @param V Active state value type
 */
export interface NFA<T, V> {
  /**
   * Create a new instance of the automaton
   */
  [Symbol.iterator](): NFAIterator<T, V>;
}

/**
 * Nondeterministic Finite Automaton (NFA) instance type
 *
 * This represents a stateful instance of a given NFA prototype.
 *
 * The exact sequence of state transitions is determined by repeatedly calling the {@link NFAIterator.next \.next()} method with a series of input tokens.
 * @param T Input token type
 * @param V Active state value type
 */
export interface NFAIterator<T, V> {
  /**
   * Transition to the next state, given the provided input token
   * @param token Input token that determines the next state
   * @returns A {@link NFAIteratorResult} instance containing the result of the state transition
   */
  next(token: T): NFAIteratorResult<V>;
  /**
   * Currently-active automaton state
   */
  current(): V;
  /**
   * Whether the automaton has reached the end of its computation
   */
  done(): boolean;
}

/**
 * Nondeterministic Finite Automaton (NFA) state transition result
 *
 * State transition results contain a `value` field indicating the newly-active state value, and a `done` field that indicates that the NFA has reached an end state from which it can proceed no further
 * @param V Active state value type
 */
export type NFAIteratorResult<V> = IteratorResult<V, V>;

/**
 * Predicate function, used to determine whether the given input token represents a valid 'next' state transition
 * @param T Input token type
 */
export interface TokenMatcher<T> {
  (token: T): boolean;
}
