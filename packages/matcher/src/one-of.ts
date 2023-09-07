import type { PatternMatcherExpression } from '@matchkit/types';

/**
 * Create a pattern matcher expression that matches any of the provided sub-patterns
 * @param T Input token type
 * @param patterns Sub-patterns to match against
 * @returns Pattern that matches the union of the provided sub-patterns
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, oneOf, value } from '@matchkit/matcher';
 * const pattern = concat(value('a'), oneOf(value('b'), value('d')), value('c'));
 * assert.ok(match(pattern, 'abc'));
 * assert.ok(match(pattern, 'adc'));
 * ```
 */
export function oneOf<T>(
  ...patterns: Array<PatternMatcherExpression<T>>
): PatternMatcherExpression<T> {
  return {
    // Add all the sub-pattern nodes to the graph
    nodes: patterns.flatMap(({ nodes }) => nodes),
    links(nodes, next) {
      // Generate references for all the sub-pattern nodes
      const links = patterns.map((pattern) => pattern.links(nodes, next));
      // Add all the sub-pattern edges and roots to the graph
      // This effectively creates multiple paths to the next state in the overall pattern matcher,
      // each going via one of the provided sub-patterns
      return {
        edges: links.flatMap(({ edges }) => edges),
        roots: links.flatMap(({ roots }) => roots),
      };
    },
  };
}
