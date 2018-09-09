const postcss = require('postcss');
const plugin = require('../');
const fs = require('fs');
const path = require('path');
const json = require('./fixtures/_fixtures.json');

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const run = (input, output, opts) => postcss([plugin(opts)])
  .process(input, { from: undefined })
  .then((result) => {
    expect(result.css).toEqual(output);
    expect(result.warnings().length).toBe(0);
  });

/**
 * Read file utility for shorter line-lengths.
 *
 * @param {String} filename The name of the file to read.
 * @returns
 */
function readFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

/**
 * Test fixtures
 * Reads JSON file of test declarations.
 */
describe('Test CSS fixtures', () => {
  json.tests.forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const input = readFile(item.fixtures.input);
        const output = readFile(item.fixtures.expected);
        const result = run(input, output, item.options);

        return result;
      });
    } else {
      // Return `null` for skipped tests
      test.skip(`${item.description}`, () => null);
    }
  });
});

// Make sure tidy rules are being removed.
// This was the first test. It remains as a fun reminder of the beginning.
test(
  'Test removal of @tidys at-rule',
  () => run(
    '@tidy columns 16; @tidy gap 0.625rem / true; @tidy edge 32px; @tidy site-max 75rem;',
    '',
    {},
  ),
);
