/* eslint-disable max-len */
const run = require('../../test');
const breakpointMatch = require('../breakpointMatch');

/**
 * Check if an atrule.param is within a range of breakpoints.
 */
describe('Get options based on a matching breakpoint value.', () => {
  // Parsed options.
  const options = {
    breakpoints: {
      '768px': {
        gap: '0.625rem',
      },
      '1024px': {
        gap: '1rem',
      },
      '1440px': {
        gap: '1.25rem',
      },
    },
  };

  test.each([
    [
      '(min-width: 900px)',
      { gap: '0.625rem' },
    ],
    [
      '(max-width: 900px)',
      { gap: '0.625rem' },
    ],
    [
      '(min-width: 768px) and (max-width: 1023px)',
      { gap: '0.625rem' },
    ],
  ])(
    'Matches %s',
    (input, expected) => {
      expect(breakpointMatch(input, options)).toEqual(expected);
    },
  );

  test.each([
    [
      '(min-width: 600px)',
      undefined,
    ],
    [
      '(max-width: 600px)',
      undefined,
    ],
    [
      '(min-width: 768px) and (max-width: 1439px)',
      undefined,
    ],
  ])(
    'Ignores %s',
    (input, expected) => {
      expect(breakpointMatch(input, options)).toEqual(expected);
    },
  );
});

const options = {
  columns: 9,
  edge: '1rem',
  gap: '0.625rem',
  breakpoints: {
    '48rem': {
      columns: 12,
      gap: '1rem',
    },
    '64rem': {
      edge: '1.25rem',
      siteMax: '90rem',
    },
  },
};

describe('The functions and properties values are replaced according a breakpoint match', () => {
  test(
    'Has no matching breakpoints',
    () => run(
      'div { margin-left: tidy-offset(2); width: 100vw; max-width: calc(100vw - tidy-var(edge) * 2); }',
      'div { margin-left: calc((((100vw - 1rem * 2) / 9 - 0.5556rem) * 2) + 0.625rem * 2); width: 100vw; max-width: calc(100vw - 1rem * 2); }',
      options,
    ),
  );

  test(
    'Matches one breakpoint exactly',
    () => run(
      '@media (min-width: 48rem) { div { tidy-span: 2; margin-left: tidy-var(\'gap\'); } }',
      '@media (min-width: 48rem) { div { width: calc((((100vw - 1rem * 2) / 12 - 0.9167rem) * 2) + 1rem); margin-left: 1rem; } }',
      options,
    ),
  );

  test(
    'Matches a complex breakpoint',
    () => run(
      '@media (min-width: 48rem) and (max-width: 63.9375rem) { div { tidy-span: 3; } }',
      '@media (min-width: 48rem) and (max-width: 63.9375rem) { div { width: calc((((100vw - 1rem * 2) / 12 - 0.9167rem) * 3) + 1rem * 2); } }',
      options,
    ),
  );

  test(
    'Ignores matching more than one breakpoint',
    () => run(
      '@media (min-width: 48rem) and (max-width: 80rem) { div { tidy-span: 3; } }',
      '@media (min-width: 48rem) and (max-width: 80rem) { div { width: calc((((100vw - 1rem * 2) / 9 - 0.5556rem) * 3) + 0.625rem * 2); } }',
      options,
    ),
  );

  test(
    'Matches a breakpoint and correctly scopes the declaration\'s @tidy option',
    () => run(
      '@media (max-width: 80rem) { div { @tidy edge 1rem; tidy-span: 2; paddding-left: tidy-var(edge); } }',
      '@media (max-width: 80rem) { div { width: calc((((100vw - 1rem * 2) / 12 - 0.9167rem) * 2) + 1rem); max-width: calc((((90rem - 1rem * 2) / 12 - 0.9167rem) * 2) + 1rem); paddding-left: 1rem; } }',
      options,
    ),
  );
});
