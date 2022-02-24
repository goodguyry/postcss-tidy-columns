/* eslint-disable max-len */
const run = require('.');
const { typical } = require('./sharedConfigs');
const { FUNCTION_REGEX } = require('../tidy-function');

/**
 * Replace `tidy-[span|offset]()` functions.
 *
 * @todo Add tests for `tidy-span(tidy-var(columns))`.
 */
describe('The `tidy-offset` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-offset()` function when inside a `calc()`` function',
    () => run(
      'div { margin-left: calc(tidy-offset(3) + 20px); }',
      'div { margin-left: calc(((((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) + 20px); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-offset()` function when inside a `calc()`` function',
    () => run(
      'div { margin-left: calc(20px + tidy-offset(3)); }',
      'div { margin-left: calc(20px + ((((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3)); }',
      typical,
    ),
  );

  test(
    'Replaces multiple `tidy-offset()`s in the same property value',
    () => run(
      'div { margin: 0 tidy-offset(3) 0 tidy-offset(1); }',
      'div { margin: 0 calc((((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) 0 calc(((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Maintains `tidy-offset` input as a /* comment */',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      'div { /* margin-left: tidy-offset(1) */ margin-left: calc(((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      { ...typical, debug: true },
    ),
  );

  test(
    'Maintains input as a /* comment */ with multiple functions in the same declaration',
    () => run(
      'div { margin: tidy-offset(1) 0 0 tidy-var(gap); }',
      'div { /* margin: tidy-offset(1) 0 0 tidy-var(gap) */ margin: calc(((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem) 0 0 1.25rem; }',
      { ...typical, debug: true },
    ),
  );
});

describe('The `tidy-span()` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-span()` function',
    () => run(
      'div { width: tidy-span(tidy-var(columns)); }',
      'div { width: calc((((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) * 12) + 1.25rem * 11); }',
      typical,
    ),
  );

  // @todo Make this pass.
  test.skip(
    'Replaces the `tidy-span()` function',
    () => run(
      'div { width: tidy-span(tidy-var(columns)); }',
      'div { width: calc((((min(100vw, 90rem) - 0.625rem * 2) / var(--tcol) - (1.25rem * var(--tcol) - (var(--tcol) - 1))) * var(--tcol)) + 1.25rem * (var(--tcol) - 1)); }',
      { ...typical, columns: 'var(--tcol)' },
    ),
  );
});

/**
 * Pattern to match `tidy-*` functions in declaration values.
 */
describe('Pattern to match `tidy-*` functions in declaration values', () => {
  test.each([
    [
      'tidy-span(3)',
      ['tidy-span(3)', 'span', '3'],
    ],
    [
      'tidy-offset(2)',
      ['tidy-offset(2)', 'offset', '2'],
    ],
  ])(
    'Matches %s',
    (input, expected) => {
      expect(FUNCTION_REGEX.test(input)).toBeTruthy();
      // Wrapped in JSON.stringify() to work around Jest bug.
      expect(JSON.stringify(input.match(FUNCTION_REGEX))).toEqual(JSON.stringify(expected));
    },
  );

  test.each([
    'tidy-var(gap)',
    'tidy-span',
    'tidy-offset',
    'calc(tidy-span(hello))',
  ])(
    'Ignores %s',
    (input) => {
      expect(input.match(FUNCTION_REGEX)).toEqual(null);
      expect(FUNCTION_REGEX.test(input)).toBeFalsy();
    },
  );
});
