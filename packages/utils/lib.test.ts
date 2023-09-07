import { test, expect } from 'vitest';

import { DoubleBuffer, IndexedGraph, IndexedGraphNFA, instantiateSubgraph } from './lib';

test('exposes a top-level DoubleBuffer class', () => {
  expect(DoubleBuffer).toBeInstanceOf(Function);
});

test('exposes a top-level IndexedGraph class', () => {
  expect(IndexedGraph).toBeInstanceOf(Function);
});

test('exposes a top-level IndexedGraphNFA class', () => {
  expect(IndexedGraphNFA).toBeInstanceOf(Function);
});

test('exposes a top-level instantiateSubgraph function', () => {
  expect(instantiateSubgraph).toBeInstanceOf(Function);
});
