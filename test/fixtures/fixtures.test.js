const fixtures = require('./_fixtures.json');
const { run, readFile } = require('../');

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
