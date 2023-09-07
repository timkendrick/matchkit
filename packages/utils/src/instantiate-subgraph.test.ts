import type { SubgraphDefinition } from '@matchkit/types';
import { test, expect } from 'vitest';

import { instantiateSubgraph } from './instantiate-subgraph';
import { IndexedGraph } from './indexed-graph';

test('allows empty subgraph definitions', () => {
  type E = string;
  type V = symbol;
  const definition: SubgraphDefinition<E, V> = {
    nodes: [],
    links(nodes, next) {
      return {
        edges: [],
        roots: [],
      };
    },
  };
  const { graph, roots } = instantiateSubgraph(definition, {
    graph: new IndexedGraph<E, V>([], []),
    roots: new Array<number>(),
  });
  expect(Array.from(graph.getValues())).toEqual([]);
  expect(Array.from(graph.getEdges())).toEqual([]);
  expect(roots).toEqual([]);
});

test('allows non-empty subgraph definitions', () => {
  type E = string;
  type V = symbol;
  const definition: SubgraphDefinition<E, V> = {
    nodes: [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
    links(nodes, next) {
      return {
        edges: [],
        roots: [],
      };
    },
  };
  const { graph, roots } = instantiateSubgraph(definition, {
    graph: new IndexedGraph<E, V>([], []),
    roots: new Array<number>(),
  });
  expect(Array.from(graph.getValues())).toEqual([
    Symbol.for('foo'),
    Symbol.for('bar'),
    Symbol.for('baz'),
  ]);
  expect(Array.from(graph.getEdges())).toEqual([]);
  expect(roots).toEqual([]);
});

test('allows defining edges between subgraph nodes', () => {
  type E = string;
  type V = symbol;
  const definition: SubgraphDefinition<E, V> = {
    nodes: [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
    links(nodes, next) {
      return {
        edges: [
          { from: nodes[0], to: nodes[1], value: 'foo' },
          { from: nodes[1], to: nodes[2], value: 'bar' },
          { from: nodes[2], to: nodes[0], value: 'baz' },
        ],
        roots: [],
      };
    },
  };
  const { graph, roots } = instantiateSubgraph(definition, {
    graph: new IndexedGraph<E, V>([], []),
    roots: new Array<number>(),
  });
  expect(Array.from(graph.getValues())).toEqual([
    Symbol.for('foo'),
    Symbol.for('bar'),
    Symbol.for('baz'),
  ]);
  expect(Array.from(graph.getEdges())).toEqual([
    { from: 0, to: 1, value: 'foo' },
    { from: 1, to: 2, value: 'bar' },
    { from: 2, to: 0, value: 'baz' },
  ]);
  expect(roots).toEqual([]);
});

test('allows defining subgraph root nodes', () => {
  type E = string;
  type V = symbol;
  const definition: SubgraphDefinition<E, V> = {
    nodes: [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
    links(nodes, next) {
      return {
        edges: [],
        roots: [nodes[1], nodes[2]],
      };
    },
  };
  const { graph, roots } = instantiateSubgraph(definition, {
    graph: new IndexedGraph<E, V>([], []),
    roots: new Array<number>(),
  });
  expect(Array.from(graph.getValues())).toEqual([
    Symbol.for('foo'),
    Symbol.for('bar'),
    Symbol.for('baz'),
  ]);
  expect(Array.from(graph.getEdges())).toEqual([]);
  expect(roots).toEqual([1, 2]);
});

test('allows extending existing graphs', () => {
  type E = string;
  type V = symbol;
  const definition: SubgraphDefinition<E, V> = {
    nodes: [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
    links(nodes, next) {
      return {
        edges: [
          { from: nodes[0], to: nodes[1], value: 'foo' },
          { from: nodes[1], to: nodes[2], value: 'bar' },
          ...next.map((to) => ({ from: nodes[2], to, value: 'baz' })),
        ],
        roots: [nodes[0]],
      };
    },
  };
  const { graph, roots } = instantiateSubgraph(definition, {
    graph: new IndexedGraph<E, V>(
      [Symbol.for('existing:1'), Symbol.for('existing:2'), Symbol.for('existing:3')],
      [
        { from: 0, to: 1, value: 'first' },
        { from: 1, to: 2, value: 'second' },
        { from: 2, to: 0, value: 'third' },
      ],
    ),
    roots: [0, 2],
  });
  expect(Array.from(graph.getValues())).toEqual([
    Symbol.for('existing:1'),
    Symbol.for('existing:2'),
    Symbol.for('existing:3'),
    Symbol.for('foo'),
    Symbol.for('bar'),
    Symbol.for('baz'),
  ]);
  expect(Array.from(graph.getEdges())).toEqual([
    { from: 0, to: 1, value: 'first' },
    { from: 1, to: 2, value: 'second' },
    { from: 2, to: 0, value: 'third' },
    { from: 3, to: 4, value: 'foo' },
    { from: 4, to: 5, value: 'bar' },
    { from: 5, to: 0, value: 'baz' },
    { from: 5, to: 2, value: 'baz' },
  ]);
  expect(roots).toEqual([3]);
});
