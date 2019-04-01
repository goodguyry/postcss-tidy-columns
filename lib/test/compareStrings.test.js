const compareStrings = require('../compareStrings');

/**
 * Compare numerical strings.
 */
describe('Compare numerical strings', () => {
  test.each([
    ['1000px', '600px', 1],
    ['600px', '600px', 0],
    ['400px', '1000px', -1],
  ])(
    '%O',
    (reference, compare, expected) => {
      expect(compareStrings(reference, compare)).toEqual(expected);
    },
  );
});
