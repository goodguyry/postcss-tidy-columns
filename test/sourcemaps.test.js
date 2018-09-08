const postcss = require('postcss');
const tidyColumns = require('../');
const fs = require('fs');
const path = require('path');
const json = require('./fixtures/_fixtures.json');
const mapFile = require('./fixtures/source-maps/mappings.json');

/**
 * Test fixtures
 * Reads JSON file of test declarations.
 */
describe('Test CSS fixtures', () => {
  json['source-maps'].forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const from = path.join(__dirname, `${item.fixtures.input}`);
        const to = path.join(__dirname, `${item.fixtures.expected}`);

        const input = fs.readFileSync(from, 'utf8');

        return postcss([
          tidyColumns({
            columns: 12,
            gap: '1.25rem',
            edge: '0.625rem',
            siteMax: '90rem',
          }),
        ])
          .process(input, { from, to, map: { inline: false } })
          .then((result) => {
            // eslint-disable-next-line no-underscore-dangle
            expect(result.map._mappings).toEqual(mapFile[item.mapKey]);
            expect(result.warnings().length).toBe(0);
          });
      });
    } else {
      // Return `null` for skipped tests
      test.skip(`${item.description}`, () => null);
    }
  });
});
