const postcss = require('postcss');
const tidyColumns = require('../..');
const { run } = require('..');
const {
  parseOptions,
  normalizeOptions,
  LENGTH_REGEX,
  getOptions,
  collectTidyRuleParams,
} = require('../../src/lib/options');
const { typical, columnsOnly } = require('../sharedConfigs');

/**
 * Options test runner.
 * Runs the plugin and verifies the options.
 */
const runOptions = (input, output, opts, plugin = tidyColumns) => (
  postcss([plugin(opts)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.options).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

module.exports = runOptions;

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runTidyRuleParamsPlugin = (input, output, opts) => (
  runOptions(input, output, opts, () => ({
    postcssPlugin: 'tidy-rule-test',
    Once(root, { result }) {
      result.options = collectTidyRuleParams(root); // eslint-disable-line no-param-reassign
    },
  }))
);

/**
 * Collect @tidy params from the provided CSS root.
 */
describe('Collect @tidy params from the provided CSS root', () => {
  test(
    'Collects options with/without colons, CSS custom Properties',
    () => runTidyRuleParamsPlugin(
      '@tidy columns 12; @tidy gap var(--gap); @tidy max: var(--tmax);',
      ['columns 12', 'gap var(--gap)', 'max: var(--tmax)'],
    ),
  );

  test.skip(
    'Ignores options at the CSS root when collection is scoped to a rule',
    () => runTidyRuleParamsPlugin(
      '@tidy columns 12;',
      [],
    ),
  );

  test(
    'Ignores options inside rules when collection is scoped to the CSS root',
    () => runTidyRuleParamsPlugin(
      'div { @tidy columns 12; }',
      [],
    ),
  );

  test(
    'Removes @tidy at-rules',
    () => run(
      '@tidy columns 16; @tidy gap 0.625rem; @tidy edge 32px; @tidy max 75rem;',
      '',
    ),
  );
});

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runGlobalOptionsPlugin = (output, opts) => (
  runOptions('', output, opts, () => ({
    postcssPlugin: 'global-options-test',
    Once(root, { result }) {
      result.options = Object.freeze(getOptions(root, opts)); // eslint-disable-line no-param-reassign
    },
  }))
);

/**
 * Collect and merge global plugin options.
 */
describe('Collect and merge global plugin options', () => {
  test(
    'Global options are collected as expected.',
    () => runGlobalOptionsPlugin(
      {
        columns: 12,
        edge: '0.625rem',
        gap: '1.25rem',
        max: '90rem',
        debug: false,
        reduce: false,
        base: '%',
      },
      { ...typical, base: '%' },
    ),
  );

  test(
    'Global debug option is collected as expected',
    () => runGlobalOptionsPlugin(
      {
        columns: 12,
        edge: '0.625rem',
        gap: '1.25rem',
        max: '90rem',
        debug: true,
        reduce: false,
        base: 'vw',
      },
      { ...typical, debug: true },
    ),
  );

  test(
    'Missing options default to `undefined`.',
    () => runGlobalOptionsPlugin(
      {
        columns: undefined,
        edge: undefined,
        gap: undefined,
        max: undefined,
        debug: false,
        reduce: false,
        base: 'vw',
      },
      {},
    ),
  );
});

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runLocalOptionsPlugin = (input, output, opts) => (
  runOptions(input, output, opts, () => ({
    postcssPlugin: 'local-options-test',
    Once(root, { result }) {
      root.walkRules((rule) => {
        result.options = getOptions(rule, opts); // eslint-disable-line no-param-reassign
      });
    },
  }))
);

/**
 * Walk any `tidy` at-rules and collect locally-scoped options.
 */
describe('Walk any `tidy` at-rules and collect locally-scoped options.', () => {
  test(
    '@tidy value overrides global option',
    () => runLocalOptionsPlugin(
      'div { @tidy columns 8; }',
      {
        columns: 8,
        edge: '0.625rem',
        gap: '1.25rem',
        max: '90rem',
      },
      typical,
    ),
  );

  test(
    '@tidy value adds a global option',
    () => runLocalOptionsPlugin(
      'div { @tidy max 90rem; @tidy debug true; }',
      {
        columns: 12,
        max: '90rem',
        debug: true,
      },
      columnsOnly,
    ),
  );

  test(
    '@tidy value set to false removes the global option',
    () => runLocalOptionsPlugin(
      'div { @tidy edge false; @tidy gap false; }',
      {
        columns: 12,
        edge: undefined,
        gap: undefined,
        max: '90rem',
      },
      typical,
    ),
  );
});

/**
 * Nomalize config.
 */
describe('Normalize option value types', () => {
  test('Omits invalid option values', () => {
    expect(normalizeOptions({
      columns: 'none',
      gap: '10vw',
      edge: 2,
      max: '90',
      base: 'px',
    }))
      .toEqual({});
  });

  test('Converts a string numerical value to a number', () => {
    expect(normalizeOptions({
      columns: '12',
    }))
      .toEqual({ columns: 12 });
  });
});

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 */
describe('Matches CSS length values of the supported unit values (px, em, rem)', () => {
  test.each([
    [
      '90rem',
      ['90rem', 'rem'],
    ],
    [
      '20px',
      ['20px', 'px'],
    ],
    [
      '4em',
      ['4em', 'em'],
    ],
    [
      '0.625rem',
      ['0.625rem', 'rem'],
    ],
  ])(
    'Correctly matches length values with supported units: %s',
    (input, expected) => {
      expect(LENGTH_REGEX.test(input)).toBeTruthy();
      // Wrapped in JSON.stringify() to work around Jest bug.
      expect(JSON.stringify(input.match(LENGTH_REGEX))).toEqual(JSON.stringify(expected));
    },
  );

  test.each([
    '90vw',
    '8vh',
    '7ch',
    '60 rem',
    '100',
  ])(
    'Ignores unsupported length values: %s',
    (input) => {
      expect(LENGTH_REGEX.test(input)).toBeFalsy();
      expect(input.match(LENGTH_REGEX)).toEqual(null);
    },
  );
});

/**
 * Parse and compile CSS @tidy at-rule parameters.
 */
describe('Parse and compile CSS @tidy at-rule parameters.', () => {
  test.each([
    [
      ['columns 12', 'gap 2rem', 'edge 2rem', 'max 90rem'],
      {
        columns: 12,
        gap: '2rem',
        edge: '2rem',
        max: '90rem',
      },
    ],
    [
      ['columns 12'],
      { columns: 12 },
    ],
    [
      ['max 90rem'],
      { max: '90rem' },
    ],
    [
      ['max 90rem'],
      { max: '90rem' },
    ],
  ])(
    'Parses: %O',
    (input, expected) => {
      expect(parseOptions(input)).toEqual(expected);
    },
  );
});
