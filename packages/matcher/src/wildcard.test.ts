import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { wildcard } from './wildcard';

const SUITE_NAME = wildcard.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = wildcard();
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = wildcard();
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = wildcard();
      const actual = match(pattern, 'b');
      const expected = true;
      expect(actual).toEqual(expected);
    }
  });
});
