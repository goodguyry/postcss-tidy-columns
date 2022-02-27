const runOptions = require('.');
const { typical } = require('../../test/sharedConfigs');
const { getOptions } = require('../options');

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
