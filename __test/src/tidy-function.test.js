/* eslint-disable max-len */
const { run, runWithWarnings } = require('..');
const { typical } = require('../sharedConfigs');
const { FUNCTION_PATTERN, getFunctionMatches } = require('../../src/tidy-function');

/**
 * Replace `tidy-[span|offset]()` functions.
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
    () => runWithWarnings(
      'div { margin-left: tidy-offset(1); }',
      'div { margin-left: calc(((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      { ...typical, debug: true },
    ),
  );

  test(
    'Maintains input as a /* comment */ with multiple functions in the same declaration',
    () => runWithWarnings(
      'div { margin: tidy-offset(1) 0 0 tidy-var(gap); }',
      'div { margin: calc(((min(100vw, 90rem) - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem) 0 0 1.25rem; }',
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
  test(
    'Replaces the `tidy-span()` function',
    () => run(
      'div { width: tidy-span(tidy-var(columns)); }',
      'div { width: calc((((min(100vw, 90rem) - 0.625rem * 2) / var(--tc-col) - (1.25rem / var(--tc-col) * (var(--tc-col) - 1))) * var(--tc-col)) + 1.25rem * (var(--tc-col) - 1)); }',
      { ...typical, columns: 'var(--tc-col)' },
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
      expect(FUNCTION_PATTERN.test(input)).toBeTruthy();
      // Wrapped in JSON.stringify() to work around Jest bug.
      expect(JSON.stringify(input.match(FUNCTION_PATTERN))).toEqual(JSON.stringify(expected));
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
      expect(input.match(FUNCTION_PATTERN)).toEqual(null);
      expect(FUNCTION_PATTERN.test(input)).toBeFalsy();
    },
  );
});

/**
 * Extract tidy-span|offset functions and note whether it is nested within a CSS calc() function.
 */
describe('Extract tidy-span|offset functions and note whether it is nested within a CSS calc() function', () => {
  test.each([
    [
      'calc(20px + tidy-span(3) + 60px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 100) + tidy-offset(3) + (60px - 1))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      'calc(20px + tidy-span(3))',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 300) + tidy-offset(3))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      'calc(20px + tidy-span(3) + (60px - 1))',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 100) + tidy-span(3) + 60px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc(tidy-span(3) + 20px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc(tidy-offset(3) + (20px * 6))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      '0 calc((20px + (100)) + (tidy-offset(3) + (60px - 1))) 0 calc(400 + 3)',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      '0 calc(((((20px + 100) / 14) * 3) + tidy-offset(3)) + (60px - 1)) 0 calc(tidy-offset(6) + 3px)',
      [
        { match: 'tidy-offset(3)', isNested: true },
        { match: 'tidy-offset(6)', isNested: true },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-span(3) + (60px - 1)) 0 calc(tidy-offset(5) + (3px * 2))',
      [
        { match: 'tidy-span(3)', isNested: true },
        { match: 'tidy-offset(5)', isNested: true },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-offset(3) + (60px - 1)) 0 calc(100px + tidy-span(4) + (3px * 2))',
      [
        { match: 'tidy-offset(3)', isNested: true },
        { match: 'tidy-span(4)', isNested: true },
      ],
    ],
    [
      '0 tidy-offset(3) 0 calc(100px + tidy-span(4) + (3px * 2))',
      [
        { match: 'tidy-offset(3)', isNested: false },
        { match: 'tidy-span(4)', isNested: true },
      ],
    ],
    [
      // No calc() function.
      '0 tidy-span(3) 0 tidy-offset(9)',
      [
        {
          match: 'tidy-span(3)',
          isNested: false,
        },
        {
          match: 'tidy-offset(9)',
          isNested: false,
        },
      ],
    ],
    [
      // No calc() function.
      '0 calc(100% - 20px) 0 tidy-offset(9)',
      [
        {
          match: 'tidy-offset(9)',
          isNested: false,
        },
      ],
    ],
  ])(
    'Detects %s',
    (input, expected) => {
      expect(getFunctionMatches(input)).toEqual(expected);
    },
  );

  test.each([
    '0 calc((20px + 100) + (60px - 1)) 0 calc(100px + (3px * 2))',
    'calc(100% - (3rem + 4rem) * 12)',
    '0 100px 50px 100px',
    "url('bg-img.jpg') no-repeat",
  ])(
    'Skips %s',
    (input) => {
      expect(getFunctionMatches(input)).toEqual([]);
    },
  );
});
