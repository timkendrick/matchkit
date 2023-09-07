import type { EdgeDefinition, EnumerableGraph, Graph, MutableGraph } from '@matchkit/types';

const EMPTY: Array<never> = [];

/**
 * Array-backed graph representation
 *
 * All data is stored in two parallel arrays: one array containing node values, and one array containing sets of edge definitions for the corresponding node. Node IDs are indices into the parallel arrays.
 *
 * This allows a more compact internal representation than the equivalent hashmap-backed graph representation, at the expense of not allowing arbitrary keys to be used for node IDs.
 * @param E Edge value type
 * @param V Vertex value type
 */
export class IndexedGraph<E, V>
  implements Graph<number, E, V>, EnumerableGraph<number, E, V>, MutableGraph<number, E, V>
{
  private nodes: Array<V>;
  private edges: Array<Array<[number, E]>>;

  /**
   * @param E Edge value type
   * @param V Vertex value type
   * @param nodes List of node values
   * @param edges List of {@link EdgeDefinition} objects declaring edges between indexed node
   */
  public constructor(nodes: Array<V>, edges: Array<EdgeDefinition<number, E>>) {
    this.nodes = nodes;
    this.edges = edges.reduce(
      (edges, { from, to, value }) => {
        edges[from].push([to, value]);
        return edges;
      },
      nodes.map((_) => new Array<[number, E]>()),
    );
  }

  public getNodeValue(id: number): V | undefined {
    return this.nodes[id];
  }

  public getNodeEdges(from: number): Iterable<[number, E]> {
    return this.edges[from] || EMPTY;
  }

  public getKeys(): Iterable<number> {
    return this.nodes.map((_, index) => index);
  }

  public getValues(): Iterable<V> {
    return this.nodes;
  }

  public getEdges(): Iterable<EdgeDefinition<number, E>> {
    return this.edges.flatMap((edges, from) => edges.map(([to, value]) => ({ from, to, value })));
  }

  public getNumNodes(): number {
    return this.nodes.length;
  }

  public getNumEdges(): number {
    return this.edges.reduce((count, edges) => count + edges.length, 0);
  }

  public insertNode(value: V): number {
    const nodeIndex = this.nodes.push(value) - 1;
    this.edges.push([]);
    return nodeIndex;
  }

  public insertEdge(from: number, to: number, edge: E): void {
    this.edges[from].push([to, edge]);
  }
}
