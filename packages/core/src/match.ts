import type { PatternMatcher, PatternMatcherExpression, TokenMatcher } from '@matchkit/types';

import { IndexedGraph, IndexedGraphNFA, instantiateSubgraph } from '@matchkit/utils';

/**
 * Determine whether the provided pattern matcher expression matches a given string
 * @param pattern Declarative representation of the pattern to match against
 * @param input Input string
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, value } from '@matchkit/matcher';
 * const pattern = concat(value('a'), value('b'), concat('c'));
 * assert.ok(match(pattern, 'abc'));
 * ```
 */
export function match(pattern: PatternMatcherExpression<string>, input: string): boolean;
/**
 * Determine whether the provided pattern matcher expression matches a given array of input tokens
 * @param T Input token type
 * @param pattern Declarative representation of the pattern to match against
 * @param input Array of input tokens
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, value } from '@matchkit/matcher';
 * const pattern = concat(value(1), value(2), concat(3));
 * assert.ok(match(pattern, [1, 2, 3]));
 * ```
 */
export function match<T>(pattern: PatternMatcherExpression<T>, input: Array<T>): boolean;
/**
 * Determine whether the provided pattern matcher expression matches a given sequence of input tokens
 * @param T Input token type
 * @param pattern Declarative representation of the pattern to match against
 * @param value Sequence of input tokens
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, value } from '@matchkit/matcher';
 * const pattern = concat(value(1), value(2), concat(3));
 * assert.ok(match(pattern, new Set(1, 2, 3).values()));
 * ```
 */
export function match<T>(pattern: PatternMatcherExpression<T>, input: Iterable<T>): boolean;
export function match<T>(pattern: PatternMatcherExpression<T>, input: Iterable<T>): boolean {
  // Create a new stateful matcher automaton from the provided pattern
  const matcher = createMatcher(pattern);
  // Run the matcher automaton
  return executeMatcher(matcher, input);
}

function createMatcher<T>(pattern: PatternMatcherExpression<T>): PatternMatcher<T> {
  // Create a new control flow graph containing just the valid end state
  const endStateValue = true;
  const states = new IndexedGraph<TokenMatcher<T>, boolean>([endStateValue], []);
  const endStateIndex = 0;
  // Extend the control flow graph with the instantiated pattern control flow graph
  const { graph, roots } = instantiateSubgraph(pattern, { graph: states, roots: [endStateIndex] });
  // Instantiate a new NFA from the given control flow graph and entry points
  return new IndexedGraphNFA(graph, roots);
}

function executeMatcher<T>(matcher: PatternMatcher<T>, tokens: Iterable<T>): boolean {
  // Initialize the automaton state
  const state = matcher[Symbol.iterator]();
  // Determine whether the initial state is a valid matching state
  let isMatch = state.current();
  // If the automaton has already matched against empty input, or has already been fully processed,
  // bail out with the result of the computation
  if (isMatch || state.done()) return isMatch;
  // Iterate over each item in the source iterator (patterns of arbitrary complexity are processed in linear time)
  for (const token of tokens) {
    // Feed the current token to the matcher automaton
    const { value, done } = state.next(token);
    isMatch = value;
    // If the automaton has been fully processed, bail out with the result of the computation
    if (done) break;
    // Otherwise if the overall pattern has been fully matched, no need to process any more input tokens
    if (isMatch) break;
  }
  // Return the result of the computation at the point of bailing out
  return isMatch;
}
