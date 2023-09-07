import type { PatternMatcherExpression } from '@matchkit/types';

/**
 * Create a pattern matcher expression that matches a single input token against a custom predicate function
 * @param T Input token type
 * @param predicate Predicate function to match against
 * @returns Pattern that matches the current input token against the provided predicate
 * @example
 * ```
 * import { match, predicate } from '@matchkit/core';
 * const pattern = predicate((token) => token.toUpperCase() === 'A');
 * assert.ok(match(pattern, 'a'));
 * assert.ok(match(pattern, 'A'));
 * ```
 */
export function predicate<T>(predicate: (token: T) => boolean): PatternMatcherExpression<T> {
  return {
    // Add a single non-exit node to the graph
    nodes: [false],
    links(nodes, next) {
      // Extract the node ID of the node created for this subgraph
      const [from] = nodes;
      return {
        // Map the subgraph's node to all subsequent entry-point nodes
        edges: next.map((to) => ({ from, to, value: predicate })),
        roots: nodes,
      };
    },
  };
}
