import { match } from '@matchkit/core';
import { test, expect, describe } from 'vitest';

import { value } from './value';

const SUITE_NAME = value.name;

describe(SUITE_NAME, () => {
  test('matches patterns correctly', () => {
    {
      const pattern = value('a');
      const actual = match(pattern, '');
      const expected = false;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = value('a');
      const actual = match(pattern, 'a');
      const expected = true;
      expect(actual).toEqual(expected);
    }
    {
      const pattern = value('a');
      const actual = match(pattern, 'b');
      const expected = false;
      expect(actual).toEqual(expected);
    }
  });
});
