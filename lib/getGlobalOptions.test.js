const postcss = require('postcss');
const getGlobalOptions = require('./getGlobalOptions');
const { typical } = require('../test/sharedConfigs');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const globalOptionsPlugin = postcss.plugin(
  'global-options-test',
  opts => function process(root, result) {
    result.globalOptions = Object.freeze(getGlobalOptions(root, opts)); // eslint-disable-line no-param-reassign
  },
);

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const runGlobalOptionsPlugin = (output, opts) => (
  postcss([globalOptionsPlugin(opts)])
    .process('', { from: undefined })
    .then((result) => {
      expect(result.globalOptions).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Run the test plugin and return the output.
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
        breakpoints: [],
      },
      typical,
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
      },
      {},
    ),
  );
});
