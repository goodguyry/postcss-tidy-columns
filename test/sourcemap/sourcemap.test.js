const postcss = require('postcss');
const tidyColumns = require('../../');
const fs = require('fs');
const sourceMapTests = require('./sourcemap.js');
const { typical } = require('../sharedConfigs');

/**
 * Test sourcemaps
 * Reads JSON file of test declarations.
 */
describe('Sourcemaps are maintained after plugin processing', () => {
  sourceMapTests.forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const { from, to } = item.fixtures;
        const input = fs.readFileSync(from, 'utf8');

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
