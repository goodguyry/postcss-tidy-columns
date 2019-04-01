const postcss = require('postcss');
const runOptions = require('.');
const run = require('../../test');
const {
  collectTidyRuleParams,
  CUSTOM_PROP_REGEX,
} = require('../collectTidyRuleParams');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runTidyRuleParamsPlugin = (input, output, opts) => (
  runOptions(input, output, opts, postcss.plugin(
    'tidy-rule-test',
    () => function process(root, result) {
      result.options = collectTidyRuleParams(root, opts); // eslint-disable-line no-param-reassign
    },
  ))
);

/**
 * Collect @tidy params from the provided CSS root.
 */
describe('Collect @tidy params from the provided CSS root', () => {
  test(
    'Collects options with/without colons, CSS custom Properties',
    () => runTidyRuleParamsPlugin(
      '@tidy columns 12; @tidy gap var(--gap); @tidy site-max: 90rem;',
      ['columns 12', 'gap var(--gap)', 'site-max: 90rem'],
      true,
    ),
  );

  test(
    'Ignores options at the CSS root when collection is scoped to a rule',
    () => runTidyRuleParamsPlugin(
      '@tidy columns 12;',
      [],
      false,
    ),
  );

  test(
    'Ignores options inside rules when collection is scoped to the CSS root',
    () => runTidyRuleParamsPlugin(
      'div { @tidy columns 12; }',
      [],
      true,
    ),
  );

  test(
    'Removes @tidy at-rules',
    () => run(
      '@tidy columns 16; @tidy gap 0.625rem; @tidy edge 32px; @tidy site-max 75rem;',
      '',
      {},
    ),
  );
});

/**
 * Pattern to match CSS Custom Properties.
 */
describe('Pattern to match CSS Custom Properties', () => {
  test.each([
    'var(--the_123-propertyNAME)',
    'var( --the_123-propertyNAME )',
  ])(
    'Matches a custom property insertion',
    (input) => {
      expect(CUSTOM_PROP_REGEX.test(input)).toBeTruthy();
    },
  );

  test.each([
    '--var-name',
    'var( hey-there )',
  ])(
    'Ignores property-like strings that aren\'t insertions',
    (input) => {
      expect(CUSTOM_PROP_REGEX.test(input)).toBeFalsy();
    },
  );
});
