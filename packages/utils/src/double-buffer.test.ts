import { test, expect, describe } from 'vitest';

import { DoubleBuffer } from './double-buffer';

const SUITE_NAME = DoubleBuffer.name;

describe(SUITE_NAME, () => {
  test('swaps between values correctly', () => {
    const buffer = new DoubleBuffer('foo', 'bar');
    expect(buffer.current()).toBe('foo');
    expect(buffer.next()).toBe('bar');
    expect(buffer.swap()).toBe('bar');
    expect(buffer.current()).toBe('bar');
    expect(buffer.next()).toBe('foo');
    expect(buffer.swap()).toBe('foo');
    expect(buffer.current()).toBe('foo');
    expect(buffer.next()).toBe('bar');
  });
});
