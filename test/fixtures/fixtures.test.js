const fs = require('fs');
const path = require('path');
const fixtures = require('./_fixtures.json');
const run = require('../');

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

/**
 * Test fixtures
 * Reads JSON file of test declarations.
 */
describe('Test CSS fixtures', () => {
  fixtures.forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const input = readFile(item.fixtures.input);
        const output = readFile(item.fixtures.expected);

        return run(input, output, item.options);
      });
    } else {
      // Return `null` for skipped tests.
      test.skip(`${item.description}`, () => null);
    }
  });
});
