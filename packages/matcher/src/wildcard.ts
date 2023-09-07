import type { PatternMatcherExpression } from '@matchkit/types';

import { predicate } from './predicate';

/**
 * Create a pattern matcher expression that matches any single input token
 * @param value Value to match against
 * @returns Pattern that matches the current input token regardless of its value
 * @example
 * ```
 * import { match } from '@matchkit/core';
 * import { wildcard } from '@matchkit/matcher';
 * const pattern = wildcard();
 * assert.ok(match(pattern, 'a'));
 * assert.ok(match(pattern, 'b'));
 * ```
 */
export function wildcard(): PatternMatcherExpression<any> {
  // Return a predicate pattern matcher that accepts all input tokens
  return predicate((token: any) => true);
}
