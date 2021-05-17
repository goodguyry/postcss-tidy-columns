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
    ['var(--the_123-propertyNAME)', true],
    ['var( --the_123-propertyNAME )', true],
    ['--var-name', false],
    ['var( hey-there )', false],
  ])(
    '%O',
    (value, expected) => {
      expect(isCustomProperty(value)).toEqual(expected);
    },
  );
});
