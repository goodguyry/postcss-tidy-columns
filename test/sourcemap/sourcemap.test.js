const postcss = require('postcss');
const tidyColumns = require('../../');
const path = require('path');
const sourceMapTests = require('./_sourcemap.json');
const { typical } = require('../sharedConfigs');
const { readFile } = require('../');

/**
 * Test sourcemaps
 * Reads JSON file of test declarations.
 */
describe('Test sourcemaps', () => {
  sourceMapTests.forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const from = path.join(__dirname, item.fixtures.input);
        const to = path.join(__dirname, item.fixtures.generated);

        const input = readFile(item.fixtures.input);

        return postcss([
          tidyColumns(Object.assign(typical, item.options)),
        ])
          .process(input, { from, to, map: { inline: false } })
          .then((result) => {
            expect(JSON.parse(result.map)).toEqual(item.map);
            expect(result.warnings().length).toBe(0);
          });
      });
    } else {
      // Return `null` for skipped tests.
      test.skip(`${item.description}`, () => null);
    }
  });
});
