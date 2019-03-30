const postcss = require('postcss');
const tidyColumns = require('../../');

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
