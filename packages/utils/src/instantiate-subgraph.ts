import type { MutableGraph, RootedGraph, SubgraphDefinition } from '@matchkit/types';

/**
 * Compose the provided subgraph into the provided graph
 * @param T Graph implementation type
 * @param K Graph node ID type
 * @param E Edge value type
 * @param V Vertex value type
 * @param definition {@link SubgraphDefinition} to instantiate
 * @param next {@link RootedGraph} instance comprising an existing graph and set of 'entry' root nodes to use as outlets for the subgraph definition
 * @returns Updated graph and new set of 'entry' root nodes determined by the subgraph definition
 */
export function instantiateSubgraph<T extends MutableGraph<K, E, V>, K, E, V>(
  definition: SubgraphDefinition<E, V>,
  next: RootedGraph<T, K, E, V>,
): RootedGraph<T, K, E, V> {
  const { graph, roots: nextRoots } = next;
  const { nodes, links } = definition;
  // Create nodes for each of the node values in the subgraph definition
  const nodeKeys = nodes.map((value) => graph.insertNode(value));
  // Determine the set of edges and roots declared by the subgraph,
  // given the newly-created subgraph nodes and the existing 'entry' outlet nodes
  const { edges, roots } = links(nodeKeys, nextRoots);
  // Insert the edges into the graph
  for (const { from, to, value } of edges) {
    graph.insertEdge(from, to, value);
  }
  // Return the updated graph and the new set of root node IDs
  // Note that this is NOT the union of the previous roots and the updated roots - any previously-existing roots must be
  // present in the set of roots defined by this subgraph in order to remain overall graph roots
  return { graph, roots: Array.from(roots) };
}
