const { strings } = require('../sort');

/**
 * Sort array of strings.
 */
describe('Sort array of strings', () => {
  test.each([
    [
      ['1000px', '600px', '400px'],
      ['400px', '600px', '1000px'],
    ],
  ])(
    'Sorts: %O',
    (input, expected) => {
      expect(input.sort(strings())).toEqual(expected);
    },
  );

  test.each([
    [
      ['1024px'],
    ],
    [
      [],
    ],
  ])(
    'Ignores: %O',
    (input) => {
      expect(input.sort(strings())).toEqual(input);
    },
  );
});
