import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { concat } from './concat';
import { oneOrMore } from './one-or-more';
import { value } from './value';

const SUITE_NAME = oneOrMore.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = oneOrMore(value('a'));
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOrMore(value('a'));
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOrMore(value('a'));
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOrMore(value('a'));
      const actual = match(pattern, 'aa');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = oneOrMore(value('a'));
      const actual = match(pattern, 'aaa');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), oneOrMore(value('b')), value('c'));
      const actual = match(pattern, 'ac');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), oneOrMore(value('b')), value('c'));
      const actual = match(pattern, 'abc');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), oneOrMore(value('b')), value('c'));
      const actual = match(pattern, 'abbc');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), oneOrMore(value('b')), value('c'));
      const actual = match(pattern, 'abbbc');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = concat(value('a'), oneOrMore(value('b')), value('c'));
      const actual = match(pattern, 'adc');
      const expected = false;
      expect(actual).toEqual(expected);
    }
  });
});
