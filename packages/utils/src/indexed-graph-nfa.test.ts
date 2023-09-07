import type { TokenMatcher } from '@matchkit/types';
import { test, expect, describe } from 'vitest';

import { IndexedGraph } from './indexed-graph';
import { IndexedGraphNFA } from './indexed-graph-nfa';

const SUITE_NAME = IndexedGraphNFA.name;

describe(SUITE_NAME, () => {
  test('allows empty CFGs', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>([], []);
    const roots = new Array<number>();
    const automaton = new IndexedGraphNFA(graph, roots);
    const state = automaton[Symbol.iterator]();
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
  });

  test('allows primitive CFGs', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>([true], []);
    const roots = [0];
    const automaton = new IndexedGraphNFA(graph, roots);
    const state = automaton[Symbol.iterator]();
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
  });

  test('allows linear CFGs', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>(
      [false, false, true],
      [
        { from: 0, to: 1, value: (value) => true },
        { from: 1, to: 2, value: (value) => true },
      ],
    );
    const roots = [0];
    const automaton = new IndexedGraphNFA(graph, roots);
    const state = automaton[Symbol.iterator]();
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: true, done: false });
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
  });

  test('allows branching CFGs', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>(
      [false, false, true],
      [
        { from: 0, to: 1, value: (value) => true },
        { from: 0, to: 2, value: (value) => true },
        { from: 1, to: 2, value: (value) => true },
      ],
    );
    const roots = [0];
    const automaton = new IndexedGraphNFA(graph, roots);
    const state = automaton[Symbol.iterator]();
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: true, done: false });
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: true, done: false });
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: true });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(true);
  });

  test('allows cyclical CFGs', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>(
      [false, false, true],
      [
        { from: 0, to: 1, value: (value) => true },
        { from: 1, to: 2, value: (value) => true },
        { from: 2, to: 0, value: (value) => true },
      ],
    );
    const roots = [0];
    const automaton = new IndexedGraphNFA(graph, roots);
    const state = automaton[Symbol.iterator]();
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: true, done: false });
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
    expect(state.current()).toBe(false);
    expect(state.done()).toBe(false);
    expect(state.next(Symbol.for('foo'))).toEqual({ value: true, done: false });
    expect(state.current()).toBe(true);
    expect(state.done()).toBe(false);
  });

  test('allows non-deterministic transitions', () => {
    const graph = new IndexedGraph<TokenMatcher<symbol>, boolean>(
      [false, false, true],
      [
        { from: 0, to: 1, value: (value) => value === Symbol.for('foo') },
        { from: 1, to: 2, value: (value) => value === Symbol.for('bar') },
      ],
    );
    const roots = [0];
    const automaton = new IndexedGraphNFA(graph, roots);
    {
      const state = automaton[Symbol.iterator]();
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(false);
      expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(false);
      expect(state.next(Symbol.for('bar'))).toEqual({ value: true, done: false });
      expect(state.current()).toBe(true);
      expect(state.done()).toBe(false);
      expect(state.next(Symbol.for('baz'))).toEqual({ value: false, done: true });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(true);
      expect(state.next(Symbol.for('qux'))).toEqual({ value: false, done: true });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(true);
    }
    {
      const state = automaton[Symbol.iterator]();
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(false);
      expect(state.next(Symbol.for('foo'))).toEqual({ value: false, done: false });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(false);
      expect(state.next(Symbol.for('baz'))).toEqual({ value: false, done: true });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(true);
      expect(state.next(Symbol.for('qux'))).toEqual({ value: false, done: true });
      expect(state.current()).toBe(false);
      expect(state.done()).toBe(true);
    }
  });
});
