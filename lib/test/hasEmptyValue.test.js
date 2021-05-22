const hasEmptyValue = require('../hasEmptyValue');

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
      expect(hasEmptyValue(values)).toEqual(expected);
    },
  );
});
