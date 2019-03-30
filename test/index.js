const postcss = require('postcss');
const tidyColumns = require('../');

/**
 * Basic test runner.
 * Runs the plugin and checks the output.
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
 * Runs the plugin and checks the output.
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

// Make sure tidy rules are being removed.
// This was the first test. It remains as a fun reminder of the beginning.
test(
  'Test removal of @tidys at-rule',
  () => run(
    '@tidy columns 16; @tidy gap 0.625rem; @tidy edge 32px; @tidy site-max 75rem;',
    '',
    {},
  ),
);
