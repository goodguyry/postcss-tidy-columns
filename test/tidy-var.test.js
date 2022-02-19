/* eslint-disable max-len */
const run = require('.');
const { typical } = require('./sharedConfigs');
const { VAR_FUNCTION_REGEX } = require('../tidy-var');

/**
 * Replace `tidy-var()` functions within property values.
 */
describe('The `tidy-var()` function is replaced with the expected option value', () => {
  test(
    'Replaces a single instance of `tidy-var()` in a declaration',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a multiple instances of `tidy-var()` in a declaration',
    () => run(
      'div { padding: 0 tidy-var(edge) 0 tidy-var(gap); }',
      'div { padding: 0 0.625rem 0 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a single-quoted `tidy-var()` value',
    () => run(
      "div { margin-left: tidy-var('gap'); }",
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a double-quoted `tidy-var()` value',
    () => run(
      'div { margin-left: tidy-var("gap"); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Ignores unknown value',
    () => run(
      'div { margin-left: tidy-var(flurm); }',
      'div { margin-left: tidy-var(flurm); }',
      typical,
    ),
  );

  test(
    'Maintains `tidy-var` input as a /* comment */',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { /* margin-left: tidy-var(gap) */ margin-left: 1.25rem; }',
      { ...typical, debug: true },
    ),
  );

  test(
    'Negates a `tidy-var()` value',
    () => run(
      'div { margin-left: -tidy-var("gap"); }',
      'div { margin-left: -1.25rem; }',
      typical,
    ),
  );
});

/**
 * Matches tidy-var() functions.
 */
describe('Matches tidy-var() functions', () => {
  test.each([
    [
      'tidy-var(gap)',
      ['tidy-var(gap)', 'gap'],
    ],
    [
      'tidy-var(edge)',
      ['tidy-var(edge)', 'edge'],
    ],
    [
      'tidy-var(siteMax)',
      ['tidy-var(siteMax)', 'siteMax'],
    ],
    [
      'tidy-var(columns)',
      ['tidy-var(columns)', 'columns'],
    ],
    [
      'tidy-span(tidy-var(columns))',
      ['tidy-var(columns)', 'columns'],
    ],
  ])(
    'Matches %s',
    (input, expected) => {
      expect(VAR_FUNCTION_REGEX.test(input)).toBeTruthy();
      // Wrapped in JSON.stringify() to work around Jest bug.
      expect(JSON.stringify(input.match(VAR_FUNCTION_REGEX))).toEqual(JSON.stringify(expected));
    },
  );

  test.each([
    'tidy-span(gap)',
    'tidy-span(4)',
    'tidy-offset(1)',
    'tidy-var(hello)',
    'calc(tidy-var(hello))',
  ])(
    'Ignores %s',
    (input) => {
      expect(VAR_FUNCTION_REGEX.test(input)).toBeFalsy();
      expect(input.match(VAR_FUNCTION_REGEX)).toEqual(null);
    },
  );
});
