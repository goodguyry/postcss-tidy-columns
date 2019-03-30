const postcss = require('postcss');
const tidyColumns = require('../');

/**
 * Basic test runner.
 * Runs the plugin and verifies the output.
 */
const run = (input, output, opts, plugin = tidyColumns) => (
  postcss([plugin(opts)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

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

module.exports = {
  run,
  runOptions,
};
