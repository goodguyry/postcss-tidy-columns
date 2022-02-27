const postcss = require('postcss');
const tidyColumns = require('..');

/**
 * Basic test runner.
 * Runs the plugin and verifies the output.
 */
exports.run = (input, output, opts, plugin = tidyColumns) => (
  postcss([plugin(opts)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Special plugin runner for deprecated properties.
 */
exports.runWithWarnings = (input, output, opts, plugin = tidyColumns) => (
  postcss([plugin(opts)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).not.toBe(0);
    })
);
