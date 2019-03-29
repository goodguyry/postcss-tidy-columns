const postcss = require('postcss');
const tidyColumns = require('../');
const fs = require('fs');
const path = require('path');

/**
 * Basic plugin test.
 * Run the plugin and return the output.
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
 * Read file utility for shorter line-lengths.
 *
 * @param {String} filename The name of the file to read.
 *
 * @return {String}
 */
function readFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

module.exports = {
  run,
  readFile,
};
