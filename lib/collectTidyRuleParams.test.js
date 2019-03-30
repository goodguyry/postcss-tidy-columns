const postcss = require('postcss');
const { run, runOptions } = require('../test');
const collectTidyRuleParams = require('./collectTidyRuleParams');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const tidyRuleParamsPlugin = postcss.plugin(
  'global-options-test',
  isCssRoot => function process(root, result) {
    result.options = collectTidyRuleParams(root, isCssRoot); // eslint-disable-line no-param-reassign
  },
);

/**
 * Run the test plugin and return the output.
 */
const runTidyRuleParamsPlugin = (input, output, opts) => (
  runOptions(input, output, opts, tidyRuleParamsPlugin)
);

/**
 * Run the test plugin and return the output.
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
