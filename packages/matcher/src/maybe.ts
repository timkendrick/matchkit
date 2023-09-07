import type { PatternMatcherExpression } from '@matchkit/types';

/**
 * Create a pattern matcher expression that optionally matches the provided sub-pattern
 * @param T Input token type
 * @param pattern Sub-pattern to match against
 * @returns Pattern that matches zero or one repetitions of the provided sub-pattern
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, maybe, value } from '@matchkit/matcher';
 * const pattern = concat(value('a'), maybe(value('b')), concat('c'));
 * assert.ok(match(pattern, 'ac'));
 * assert.ok(match(pattern, 'abc'));
 * ```
 */
export function maybe<T>(pattern: PatternMatcherExpression<T>): PatternMatcherExpression<T> {
  return {
    // Add the sub-pattern nodes to the graph
    nodes: pattern.nodes,
    links(nodes, next) {
      // Generate the references for the sub-pattern
      const { edges, roots } = pattern.links(nodes, next);
      return {
        edges,
        // Combine the sub-pattern entry-point nodes with the existing entry-point nodes,
        // effectively creating two paths to the next state in the overall pattern matcher
        // (one going via the sub-pattern matcher, the other jumping straight there)
        roots: [...roots, ...next],
      };
    },
  };
}
