const fixtures = require('./test/fixtures/_fixtures.json');
const { run, readFile } = require('./test');

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
