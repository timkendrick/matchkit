import type { PatternMatcherExpression, PatternMatcherEdgeDefinition } from '@matchkit/types';

/**
 * Create a pattern matcher expression that matches the provided sub-patterns in consecutive order
 * @param T Input token type
 * @param patterns Sub-patterns to combine
 * @returns Pattern that matches the concatenation of the provided sub-patterns
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { concat, value } from '@matchkit/matcher';
 * const pattern = concat(value('a'), value('b'), concat('c'));
 * assert.ok(match(pattern, 'abc'));
 * ```
 */
export function concat<T>(
  ...patterns: Array<PatternMatcherExpression<T>>
): PatternMatcherExpression<T> {
  return {
    // Combine the nodes from all the provided sub-patterns
    nodes: patterns.flatMap(({ nodes }) => nodes),
    links(nodes, next) {
      // Extract an alias to the generic Node ID type from the implicit argument type
      type K = (typeof nodes)[number];
      // Compose the input sub-patterns into a single combined subgraph
      const { edges, roots } = patterns.reduceRight(
        (results, pattern) => {
          const { roots: nextRoots, numPrecedingNodes } = results;
          const {
            // Keep track of how many nodes belong to this sub-pattern's subgraph
            nodes: { length: numNodes },
            links,
          } = pattern;
          // Locate the set of nodes that originated from this sub-pattern's subgraph
          const nodeKeys = nodes.slice(numPrecedingNodes, numPrecedingNodes + numNodes);
          // Generate the references for this sub-pattern's subgraph
          const { edges, roots } = links(nodeKeys, nextRoots);
          // Splice the edges and roots into the combined subgraph
          results.edges.push(...edges);
          results.roots = roots;
          // Keep track of how many nodes were created for this sub-pattern's subgraph
          // (used when locating the nodes created for subsequent sub-patterns)
          results.numPrecedingNodes += numNodes;
          return results;
        },
        {
          edges: new Array<PatternMatcherEdgeDefinition<K, T>>(),
          roots: next,
          numPrecedingNodes: 0,
        },
      );
      return { edges, roots };
    },
  };
}
