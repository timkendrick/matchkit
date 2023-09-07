import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { predicate } from './predicate';

const SUITE_NAME = predicate.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = predicate((token: string) => token.toUpperCase() == 'A');
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = predicate((token: string) => token.toUpperCase() == 'A');
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = predicate((token: string) => token.toUpperCase() == 'A');
      const actual = match(pattern, 'A');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = predicate((token: string) => token.toUpperCase() == 'A');
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
  });
});
