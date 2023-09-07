import { test, expect } from 'vitest';

import { match } from './lib';

test('exposes a top-level match function', () => {
  expect(match).toBeInstanceOf(Function);
});
