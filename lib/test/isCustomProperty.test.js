const { isCustomProperty } = require('../isCustomProperty');

/**
 * Compare numerical strings.
 */
describe('Check if the values have the same units', () => {
  test.each([
    ['var(--var-name)', true],
    ['var(--var-name, fallback)', true],
    ['3rem', false],
    ['14px', false],
  ])(
    '%O',
    (value, expected) => {
      expect(isCustomProperty(value)).toEqual(expected);
    },
  );
});
