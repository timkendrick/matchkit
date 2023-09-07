import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { oneOf } from './one-of';
import { value } from './value';

const SUITE_NAME = oneOf.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = oneOf();
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOf();
      const actual = match(pattern, 'a');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOf(value('a'), value('b'));
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOf(value('a'), value('b'));
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOf(value('a'), value('b'));
      const actual = match(pattern, 'b');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOf(value('a'), value('b'));
      const actual = match(pattern, 'c');
      const expected = false;
      expect(actual).toEqual(expected);
    }
  });
});
