/* eslint-disable max-len */
const run = require('.');
const { typical } = require('./sharedConfigs');
const { FUNCTION_REGEX } = require('../tidy-function');

/**
 * Replace `tidy-[span|offset]()` and `tidy-[span|offset]-full()` functions.
 */
describe('The `tidy-offset` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-offset()` function',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      // calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { margin-left: calc(8.3333vw + 0rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-offset-full()` function',
    () => run(
      'div { margin-left: tidy-offset-full(1); }',
      // calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { margin-left: 7.5rem; }',
      typical,
    ),
  );

  // @todo This shouldn't have a nested `calc()`.
  test(
    'Replaces the `tidy-offset()` function when inside a `calc()`` function',
    () => run(
      'div { margin-left: calc(tidy-offset(3) + 20px); }',
      // calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3)
      'div { margin-left: calc((25vw + 0.0001rem) + 20px); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-offset()` function when inside a `calc()`` function',
    () => run(
      'div { margin-left: calc(20px + tidy-offset(3)); }',
      // calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3)
      'div { margin-left: calc(20px + (25vw + 0.0001rem)); }',
      typical,
    ),
  );

  test(
    'Replaces multiple `tidy-offset()`s in the same property value',
    () => run(
      'div { margin: 0 tidy-offset(3) 0 tidy-offset(1); }',
      // calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3)
      // calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { margin: 0 calc(25vw + 0.0001rem) 0 calc(8.3333vw + 0rem); }',
      typical,
    ),
  );

  test(
    'Maintains `tidy-offset` input as a /* comment */',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      // calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { /* margin-left: tidy-offset(1) */ margin-left: calc(8.3333vw + 0rem); }',
      { ...typical, debug: true },
    ),
  );

  test(
    'Maintains `tidy-offset-full` input as a /* comment */',
    () => run(
      'div { margin-left: tidy-offset-full(1); }',
      // calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { /* margin-left: tidy-offset-full(1) */ margin-left: 7.5rem; }',
      { ...typical, debug: true },
    ),
  );

  test(
    'Maintains input as a /* comment */ with multiple functions in the same declaration',
    () => run(
      'div { margin: tidy-offset(1) 0 0 tidy-var(gap); }',
      // calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      'div { /* margin: tidy-offset(1) 0 0 tidy-var(gap) */ margin: calc(8.3333vw + 0rem) 0 0 1.25rem; }',
      { ...typical, debug: true },
    ),
  );
});

describe('The `tidy-span()` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-span()` function',
    () => run(
      'div { width: tidy-span(1); }',
      // calc((100vw - 0.625rem * 2) / 12 - 1.1458rem)
      'div { width: calc(8.3333vw - 1.25rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-span-full()` function',
    () => run(
      'div { max-width: tidy-span-full(1); }',
      // calc((90rem - 0.625rem * 2) / 12 - 1.1458rem)
      'div { max-width: 6.25rem; }',
      typical,
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
      ['tidy-span(3)', 'span', null, '3'],
    ],
    [
      'tidy-offset(2)',
      ['tidy-offset(2)', 'offset', null, '2'],
    ],
    [
      'tidy-span-full(1)',
      ['tidy-span-full(1)', 'span', '-full', '1'],
    ],
    [
      'tidy-offset-full(4)',
      ['tidy-offset-full(4)', 'offset', '-full', '4'],
    ],
    [
      'calc(tidy-span-full(1) + 20px)',
      ['tidy-span-full(1)', 'span', '-full', '1'],
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
