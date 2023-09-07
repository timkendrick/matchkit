import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { concat } from './concat';
import { value } from './value';

const SUITE_NAME = concat.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = concat();
      const actual = match(pattern, '');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat();
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'));
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'));
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'));
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'));
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'));
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'));
      const actual = match(pattern, 'a');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'));
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'));
      const actual = match(pattern, 'ab');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'));
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, 'a');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, 'ab');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), value('b'), value('c'));
      const actual = match(pattern, 'abc');
      const expected = true;
      expect(actual).toEqual(expected);
    }
  });
});
