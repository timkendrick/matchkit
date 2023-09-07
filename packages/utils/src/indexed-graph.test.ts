import { test, expect, describe } from 'vitest';

import { IndexedGraph } from './indexed-graph';

const SUITE_NAME = IndexedGraph.name;

describe(SUITE_NAME, () => {
  test('allows empty graphs', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>([], []);
    expect(Array.from(graph.getKeys())).toEqual([]);
    expect(Array.from(graph.getValues())).toEqual([]);
    expect(Array.from(graph.getEdges())).toEqual([]);
    expect(graph.getNumNodes()).toBe(0);
    expect(graph.getNumEdges()).toBe(0);
  });

  test('allows non-empty graphs', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [],
    );
    expect(Array.from(graph.getKeys())).toEqual([0, 1, 2]);
    expect(Array.from(graph.getValues())).toEqual([
      Symbol.for('foo'),
      Symbol.for('bar'),
      Symbol.for('baz'),
    ]);
    expect(Array.from(graph.getEdges())).toEqual([]);
    expect(graph.getNumNodes()).toBe(3);
    expect(graph.getNumEdges()).toBe(0);
  });

  test('allows defining edges between graph nodes', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    expect(Array.from(graph.getKeys())).toEqual([0, 1, 2]);
    expect(Array.from(graph.getValues())).toEqual([
      Symbol.for('foo'),
      Symbol.for('bar'),
      Symbol.for('baz'),
    ]);
    expect(Array.from(graph.getEdges())).toEqual([
      { from: 0, to: 1, value: 'foo>bar' },
      { from: 0, to: 2, value: 'foo>baz' },
      { from: 1, to: 2, value: 'bar>baz' },
      { from: 2, to: 0, value: 'baz>foo' },
    ]);
    expect(graph.getNumNodes()).toBe(3);
    expect(graph.getNumEdges()).toBe(4);
  });

  test('allows retrieving node values', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    expect(graph.getNodeValue(0)).toBe(Symbol.for('foo'));
    expect(graph.getNodeValue(1)).toBe(Symbol.for('bar'));
    expect(graph.getNodeValue(2)).toBe(Symbol.for('baz'));
    expect(graph.getNodeValue(3)).toBeUndefined();
  });

  test('allows retrieving node edges', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    expect(graph.getNodeEdges(0)).toEqual([
      [1, 'foo>bar'],
      [2, 'foo>baz'],
    ]);
    expect(graph.getNodeEdges(1)).toEqual([[2, 'bar>baz']]);
    expect(graph.getNodeEdges(2)).toEqual([[0, 'baz>foo']]);
    expect(graph.getNodeEdges(3)).toEqual([]);
  });

  test('allows inserting new nodes', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    graph.insertNode(Symbol.for('qux'));
    expect(Array.from(graph.getValues())).toEqual([
      Symbol.for('foo'),
      Symbol.for('bar'),
      Symbol.for('baz'),
      Symbol.for('qux'),
    ]);
    expect(graph.getNumNodes()).toBe(4);
  });

  test('allows inserting new edges', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    graph.insertEdge(1, 0, 'bar>foo');
    expect(Array.from(graph.getEdges())).toEqual([
      { from: 0, to: 1, value: 'foo>bar' },
      { from: 0, to: 2, value: 'foo>baz' },
      { from: 1, to: 2, value: 'bar>baz' },
      { from: 1, to: 0, value: 'bar>foo' },
      { from: 2, to: 0, value: 'baz>foo' },
    ]);
    expect(graph.getNumEdges()).toBe(5);
  });

  test('allows inserting new edges for newly-added nodes', () => {
    type E = string;
    type V = symbol;
    const graph = new IndexedGraph<E, V>(
      [Symbol.for('foo'), Symbol.for('bar'), Symbol.for('baz')],
      [
        { from: 0, to: 1, value: 'foo>bar' },
        { from: 0, to: 2, value: 'foo>baz' },
        { from: 1, to: 2, value: 'bar>baz' },
        { from: 2, to: 0, value: 'baz>foo' },
      ],
    );
    graph.insertNode(Symbol.for('qux'));
    graph.insertEdge(1, 3, 'bar>qux');
    graph.insertEdge(3, 0, 'qux>foo');
    expect(Array.from(graph.getEdges())).toEqual([
      { from: 0, to: 1, value: 'foo>bar' },
      { from: 0, to: 2, value: 'foo>baz' },
      { from: 1, to: 2, value: 'bar>baz' },
      { from: 1, to: 3, value: 'bar>qux' },
      { from: 2, to: 0, value: 'baz>foo' },
      { from: 3, to: 0, value: 'qux>foo' },
    ]);
    expect(graph.getNumEdges()).toBe(6);
  });
});
