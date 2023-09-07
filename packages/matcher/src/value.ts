import type { PatternMatcherExpression } from '@matchkit/types';

import { predicate } from './predicate';

/**
 * Create a pattern matcher expression that matches a single input token against the provided value
 * @param T Input token type
 * @param value Value to match against
 * @returns Pattern that matches the current input token based on strict equality with the provided value
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { value } from '@matchkit/matcher';
 * const pattern = value('a');
 * assert.ok(match(pattern, 'a'));
 * ```
 */
export function value<T>(value: T): PatternMatcherExpression<T> {
  // Return a predicate pattern matcher that only accepts input tokens that are strictly equal to the provided value
  return predicate((token: T) => token === value);
}
