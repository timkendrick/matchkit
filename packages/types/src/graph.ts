/**
 * Interface for implementing arbitrary graph structures
 * @param K Graph node ID type
 * @param E Edge value type
 * @param V Vertex value type
 */
export interface Graph<K, E, V> {
  /**
   * Retrieve the value corresponding to a particular node within this graph
   * @param id Node ID to retrieve
   * @returns Value corresponding to the given node ID if the provided node ID is present in this graph, or `undefined` if the provided node ID is not present in this graph
   */
  getNodeValue(id: K): V | undefined;
  /**
   * Retrieve a list of outbound edges from a particular node within this graph
   * @param from Node ID of the starting node
   * @returns List of edges traversible from the provided node ID (where each list item is a 2-item tuple comprising the target node ID and the associated edge value), or an empty list if the provided node ID is not present in this graph
   */
  getNodeEdges(from: K): Iterable<[K, E]>;
}

/**
 * Interface for implementing arbitrary graph structures that extends the base {@link Graph} interface with methods for enumerating vertices and edges
 * @param K Graph node ID type
 * @param E Edge value type
 * @param V Vertex value type
 */
export interface EnumerableGraph<K, E, V> extends Graph<K, E, V> {
  /**
   * Enumerate the IDs of all nodes present within this graph
   */
  getKeys(): Iterable<K>;
  /**
   * Enumerate the values of all nodes present within this graph
   */
  getValues(): Iterable<V>;
  /**
   * Enumerate all edges present within this graph
   */
  getEdges(): Iterable<EdgeDefinition<K, E>>;
  /**
   * Retrieve the total number of nodes defined by this graph
   */
  getNumNodes(): number;
  /**
   * Retrieve the total number of edges defined by this graph
   */
  getNumEdges(): number;
}

/**
 * Interface for implementing arbitrary graph structures that extends the base {@link Graph} interface with methods for inserting vertices and edges
 * @param K Graph node ID type
 * @param E Edge value type
 * @param V Vertex value type
 */
export interface MutableGraph<K, E, V> extends Graph<K, E, V> {
  /**
   * Insert a new node into the graph
   * @param value Node value
   * @returns Node ID of the newly-created node
   */
  insertNode(value: V): K;
  /**
   * Insert a new edge into the graph
   * @param from Node ID of the source node
   * @param to Node ID of the target node
   * @param edge Edge value
   */
  insertEdge(from: K, to: K, edge: E): void;
}

/**
 * Declarative representation of a subgraph that can compose into a larger graph
 *
 * The declarative nature of the subgraph definition API allows it to be used as a 'factory blueprint' that can be used with arbitrary graph implementations
 * @param E Edge value type
 * @param V Vertex value type
 */
export interface SubgraphDefinition<E, V> {
  /**
   * List of values that defines the nodes present in this subgraph
   */
  nodes: Array<V>;
  /**
   * Factory function that takes the set of node IDs defined by this subgraph and a set of 'exit' node IDs that act as
   * outlets into the next subgraph, and returns a set of edges between nodes and a set of 'entry' node IDs that act as
   * inlets into this subgraph.
   *
   * The graph node ID type is determined by the caller and depends on the concrete graph implementation.
   *
   * This function must be a pure function with respect to the set of input nodes (i.e. repeated calls with the same input node IDs must always return an equivalent set of edge/root definitions)
   * @param K Graph node ID type
   * @param nodes IDs of nodes present in this subgraph, in the order defined by the {@link SubgraphDefinition.nodes \.nodes} field of the subgraph definition
   * @param next IDs of nodes that represent 'exit' node outlets into the next subgraph
   * @returns A set of {@link SubgraphDefinitionLinks} representing the edges/roots used to link nodes within the subgraph and the provided outlet nodes, and provide external inlets to the subgraph
   */
  links<K>(nodes: Array<K>, next: Array<K>): SubgraphDefinitionLinks<K, E>;
}

/**
 * Declarative representation of the edges/roots used to link nodes within a given {@link SubgraphDefinition} and its surrounding nodes, and define external inlets to the subgraph
 * @param K Graph node ID type
 * @param E Edge value type
 */
export interface SubgraphDefinitionLinks<K, E> {
  /**
   * Set of edges between graph nodes
   */
  edges: Array<EdgeDefinition<K, E>>;
  /**
   * Set of 'entry' nodes that act as inlets into the subgraph
   */
  roots: Array<K>;
}

/**
 * Declarative representation of an edge between two graph nodes
 * @param K Graph node ID type
 * @param E Edge value type
 */
export interface EdgeDefinition<K, E> {
  from: K;
  to: K;
  value: E;
}

/**
 * Combination of a graph and a set of root nodes within that graph
 * @param T Graph implementation type
 * @param K Graph node ID type
 * @param E Edge value type
 * @param V Vertex value type
 */
export interface RootedGraph<T extends Graph<K, E, V>, K, E, V> {
  /**
   * Graph instance
   */
  graph: T;
  /**
   * Set of root node IDs within the graph
   */
  roots: Array<K>;
}
