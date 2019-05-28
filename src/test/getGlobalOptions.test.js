const postcss = require('postcss');
const runOptions = require('.');
const { typical } = require('../../test/sharedConfigs');
const getGlobalOptions = require('../getGlobalOptions');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runGlobalOptionsPlugin = (output, opts) => (
  runOptions('', output, opts, postcss.plugin(
    'global-options-test',
    () => function process(root, result) {
      result.options = Object.freeze(getGlobalOptions(root, opts)); // eslint-disable-line no-param-reassign
    },
  ))
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
        siteMax: '90rem',
        debug: false,
        breakpoints: [],
      },
      typical,
    ),
  );

  test(
    'Global debug option is collected as expected',
    () => runGlobalOptionsPlugin(
      {
        columns: 12,
        edge: '0.625rem',
        gap: '1.25rem',
        siteMax: '90rem',
        debug: true,
        breakpoints: [],
      },
      { ...typical, debug: true },
    ),
  );

  test(
    'Missing options default to `undefined`.',
    () => runGlobalOptionsPlugin(
      {
        columns: undefined,
        breakpoints: [],
        edge: undefined,
        gap: undefined,
        siteMax: undefined,
        debug: false,
      },
      {},
    ),
  );
});
