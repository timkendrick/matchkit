import type { PatternMatcherExpression } from '@matchkit/types';

/**
 * Create a pattern matcher expression that matches zero or more repetitions of the provided sub-pattern
 * @param T Input token type
 * @param pattern Sub-pattern to match against
 * @returns Pattern that matches zero or more repetitions of the provided sub-pattern
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, value, zeroOrMore } from '@matchkit/matcher';
 * const pattern = concat(value('a'), zeroOrMore(value('b')), concat('c'));
 * assert.ok(match(pattern, 'ac'));
 * assert.ok(match(pattern, 'abbbc'));
 * ```
 */
export function zeroOrMore<T>(pattern: PatternMatcherExpression<T>): PatternMatcherExpression<T> {
  return {
    nodes: pattern.nodes,
    links(nodes, next) {
      // We need to create a cycle in the graph, where the node's exit point feeds back to its own entry point.
      // This can be hard to achieve declaratively because we don't yet know the ID of the node entry points.
      // To get around this, we rely on the fact that the sub-pattern's reference factory must be a pure function with
      // respect to the set of input nodes, returning a deterministic list of root nodes for that set of input nodes.
      // First we generate the references for the sub-pattern in order to obtain its entry-point node IDs
      const { roots } = pattern.links(nodes, next);
      // Now that we know what the entry-point node IDs for the subgraph will be, regenerate the references with the
      // same set of input nodes, but a combined set of successor entry nodes that also contains the entry-point nodes
      // for this sub-pattern, effectively linking the sub-pattern's exit points to its own entry points
      const { edges } = pattern.links(nodes, [...roots, ...next]);
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
