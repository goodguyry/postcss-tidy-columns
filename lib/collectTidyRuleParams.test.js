const postcss = require('postcss');
const collectTidyRuleParams = require('./collectTidyRuleParams');
// const { typical } = require('../test/sharedConfigs');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const globalOptionsPlugin = postcss.plugin(
  'global-options-test',
  isCssRoot => function process(root, result) {
    result.options = collectTidyRuleParams(root, isCssRoot); // eslint-disable-line no-param-reassign
  },
);

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const runGlobalOptionsPlugin = (input, output, isCssRoot) => (
  postcss([globalOptionsPlugin(isCssRoot)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.options).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Run the test plugin and return the output.
 */
describe('Collect @tidy params from the provided CSS root', () => {
  test(
    'Collects options with/without colons, CSS custom Properties',
    () => runGlobalOptionsPlugin(
      '@tidy columns 12; @tidy gap var(--gap); @tidy site-max: 90rem;',
      ['columns 12', 'gap var(--gap)', 'site-max: 90rem'],
      true,
    ),
  );

  test(
    'Ignores options at the CSS root when collection is scoped to a rule',
    () => runGlobalOptionsPlugin(
      '@tidy columns 12;',
      [],
      false,
    ),
  );

  test(
    'Ignores options inside rules when collection is scoped to the CSS root',
    () => runGlobalOptionsPlugin(
      'div { @tidy columns 12; }',
      [],
      true,
    ),
  );
});
