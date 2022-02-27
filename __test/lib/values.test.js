const {
  isEmpty,
  isCustomProperty,
  roundToPrecision,
} = require('../../src/lib/values');

/**
 * Compare numerical strings.
 */
describe('Check if the values have the same units', () => {
  test.each([
    ['100px', '100px', false],
    ['Zero string', '0', true],
    ['Zero', 0, true],
    ['undefined', undefined, true],
    ['null', null, true],
  ])(
    '%O',
    (description, values, expected) => {
      expect(isEmpty(values)).toEqual(expected);
    },
  );
});

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

/**
 * Compare numerical strings.
 */
describe('Round the given number to the specified number of decimal places', () => {
  test.each([
    ['Rounds to a single decimal place', [1.2345, 1], 1.2],
    ['Rounds to two decimal places', [1.2345, 2], 1.23],
    ['Rounds to three decimal places', [1.2345, 3], 1.235],
    ['Rounds to four decimal places', [1.2345, 4], 1.2345],
    ['Ignores rounding a number shorter than the precision', [1.2, 4], 1.2],
    ['Ignores a whole number', [1, 3], 1],
    ['Rounds to zero decimal places', [1.234, 0], 1],
    ['Ignores rounding a `0`', [0, 4], 0],
    ['Rounds a negative number as expected', [-1.2345, 2], -1.23],
  ])(
    '%O',
    (description, parameters, expected) => {
      const [value, precision] = parameters;
      expect(roundToPrecision(value, precision)).toEqual(expected);
    },
  );
});
