const parseOptions = require('../parseOptions');

/**
 * Parse and compile CSS @tidy at-rule parameters.
 */
describe('Parse and compile CSS @tidy at-rule parameters.', () => {
  test.each([
    [
      ['columns 12', 'gap 2rem', 'edge 2rem', 'max 90rem'],
      {
        columns: 12,
        gap: '2rem',
        edge: '2rem',
        max: '90rem',
      },
    ],
    [
      ['columns 12'],
      { columns: 12 },
    ],
    [
      ['max 90rem'],
      { max: '90rem' },
    ],
    [
      ['max 90rem'],
      { max: '90rem' },
    ],
  ])(
    'Parses: %O',
    (input, expected) => {
      expect(parseOptions(input)).toEqual(expected);
    },
  );
});
