import { test, expect } from 'vitest';

import { concat, maybe, oneOf, oneOrMore, predicate, value, wildcard, zeroOrMore } from './lib';

test('exposes pattern constructors', () => {
  expect(concat).toBeInstanceOf(Function);
  expect(maybe).toBeInstanceOf(Function);
  expect(oneOf).toBeInstanceOf(Function);
  expect(oneOrMore).toBeInstanceOf(Function);
  expect(predicate).toBeInstanceOf(Function);
  expect(value).toBeInstanceOf(Function);
  expect(wildcard).toBeInstanceOf(Function);
  expect(zeroOrMore).toBeInstanceOf(Function);
});
