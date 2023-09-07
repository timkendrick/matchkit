import { concat, value } from '@matchkit/matcher';
import { test, expect, describe } from 'vitest';

import { match } from './match';

const SUITE_NAME = match.name;

describe(SUITE_NAME, () => {
  test('matches strings', () => {
    const pattern = concat(value('a'), value('b'), value('c'));
    const actual = match(pattern, 'abc');
    const expected = true;
    expect(actual).toBe(expected);
  });

  test('matches arrays', () => {
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, ['a', 'b', 'c']);
      const expected = true;
      expect(actual).toBe(expected);
    }
    {
      const pattern = concat(value(1), value(2), value(3));
      const actual = match(pattern, [1, 2, 3]);
      const expected = true;
      expect(actual).toBe(expected);
    }
  });

  test('matches iterables', () => {
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, new Set(['a', 'b', 'c']).values());
      const expected = true;
      expect(actual).toBe(expected);
    }
    {
      const pattern = concat(value(1), value(2), value(3));
      const actual = match(pattern, new Set([1, 2, 3]).values());
      const expected = true;
      expect(actual).toBe(expected);
    }
  });
});
