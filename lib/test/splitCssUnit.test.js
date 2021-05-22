const splitCssUnit = require('../splitCssUnit');

/**
 * Compare numerical strings.
 */
describe("Separate a CSS length value's number from its units", () => {
  test.each([
    ['Separates a `px` value from its units', '10px', [10, 'px']],
    ['Separates a `rem` value from its units', '0.625rem', [0.625, 'rem']],
    ['Separates a `em` value from its units', '2em', [2, 'em']],
    ['Ignores a unitless value', 12, [12, undefined]],
  ])(
    '%O',
    (description, value, expected) => {
      expect(splitCssUnit(value)).toEqual(expected);
    },
  );
});
