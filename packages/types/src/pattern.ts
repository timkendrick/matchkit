import type { SubgraphDefinition, EdgeDefinition } from './graph';
import type { NFA, TokenMatcher } from './nfa';

/**
 * Declarative representation of a pattern matcher sub-expression that can compose into a larger pattern.
 *
 * Pattern matcher expressions are implemented as a regular expression control flow graph, where each element of the overall expression is encoded as one or more nodes in the graph.
 * The nodes represent the valid states the matcher can occupy as it consumes a sequence input tokens.
 *
 * Within the control flow graph, each node's value is a boolean denoting whether that node is a valid end state for the overall pattern (a match), and each edge's value is a {@link TokenMatcher} used to determine the valid next states for a given input token.
 * @param T Input token type
 * @see https://swtch.com/~rsc/regexp/regexp1.html
 */
export type PatternMatcherExpression<T> = SubgraphDefinition<TokenMatcher<T>, boolean>;

/**
 * Declarative representation of an edge within a {@link PatternMatcherExpression} control flow graph
 * @param K Graph node ID type
 * @param T Input token type
 */
export type PatternMatcherEdgeDefinition<K, T> = EdgeDefinition<K, TokenMatcher<T>>;

/**
 * Base interface for a Nondeterministic Finite Automaton representing a regular expression pattern matcher
 *
 * Once instantiated, the NFA consumes a series of input tokens and determines whether the input sequence so far is a match.
 *
 * Pattern matcher instances are typically created by instantiating a {@link PatternMatcherExpression} blueprint.
 * @param T Input token type
 */
export interface PatternMatcher<T> extends NFA<T, boolean> {}
