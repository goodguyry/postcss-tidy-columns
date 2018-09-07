const postcss = require('postcss');
const tidyColumns = require('../');
const fs = require('fs');
const path = require('path');
const json = require('./fixtures/_fixtures.json');

/**
 * Test fixtures
 * Reads JSON file of test declarations.
 */
describe('Test CSS fixtures', () => {
  json['source-maps'].forEach((item) => {
    if (!item.skip) {
      test(`${item.description}`, () => {
        const from = path.join(__dirname, `${item.root}/${item.name}.css`);
        const to = path.join(__dirname, `${item.root}/${item.name}.generated.css`);

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
            expect(result.map._mappings).toEqual({ "_array": [{ "originalLine": 1, "originalColumn": 0, "generatedLine": 1, "generatedColumn": 0, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 1, "generatedLine": 2, "generatedColumn": 1, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 21, "generatedLine": 2, "generatedColumn": 72, "name": null, "source": "offset-left.css" }, { "originalLine": 3, "originalColumn": 1, "generatedLine": 3, "generatedColumn": 1, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 1, "generatedLine": 4, "generatedColumn": 0, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 1, "generatedLine": 5, "generatedColumn": 1, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 1, "generatedLine": 6, "generatedColumn": 2, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 21, "generatedLine": 6, "generatedColumn": 73, "name": null, "source": "offset-left.css" }, { "originalLine": 2, "originalColumn": 21, "generatedLine": 7, "generatedColumn": 2, "name": null, "source": "offset-left.css" }, { "originalLine": 1, "originalColumn": 0, "generatedLine": 8, "generatedColumn": 1, "name": null, "source": "offset-left.css" }], "_last": { "originalLine": 1, "originalColumn": 0, "generatedLine": 8, "generatedColumn": 1, "name": null, "source": "offset-left.css" }, "_sorted": true }); // eslint-disable-line
            expect(result.warnings().length).toBe(0);
          });
      });
    } else {
      // Return `null` for skipped tests
      test.skip(`${item.description}`, () => null);
    }
  });
});
