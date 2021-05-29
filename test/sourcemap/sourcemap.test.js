const postcss = require('postcss');
const fs = require('fs');
const tidyColumns = require('../..');
const sourceMapTests = require('./sourcemap');

/**
 * Test sourcemaps
 * Reads JSON file of test declarations.
 */
describe('Sourcemaps are maintained after plugin processing', () => {
  const reducedTests = sourceMapTests.reduce((acc, test) => ([...acc, Object.values(test)]), []);

  test.each(reducedTests)(
    '%s',
    (description, options, map, fixtures) => {
      const { from, to } = fixtures;
      const input = fs.readFileSync(from, 'utf8');

      return postcss([
        tidyColumns(options),
      ])
        .process(input, { from, to, map: { inline: false } })
        .then((result) => {
          expect(JSON.parse(result.map)).toEqual(map);
          expect(result.warnings().length).toBe(0);
        });
    },
  );
});
