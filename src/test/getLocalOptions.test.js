const runOptions = require('.');
const { typical, columnsOnly } = require('../../test/sharedConfigs');
const getLocalOptions = require('../getLocalOptions');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runLocalOptionsPlugin = (input, output, opts) => (
  runOptions(input, output, opts, () => ({
    postcssPlugin: 'local-options-test',
    Once(root, { result }) {
      root.walkRules((rule) => {
        result.options = getLocalOptions(rule, opts); // eslint-disable-line no-param-reassign
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
        siteMax: '90rem',
      },
      typical,
    ),
  );

  test(
    '@tidy value adds a global option',
    () => runLocalOptionsPlugin(
      'div { @tidy site-max 90rem; @tidy debug true; }',
      {
        columns: 12,
        siteMax: '90rem',
        debug: true,
      },
      columnsOnly,
    ),
  );
});
