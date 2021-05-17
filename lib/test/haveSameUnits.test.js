const haveSameUnits = require('../haveSameUnits');

/**
 * Compare numerical strings.
 */
describe('Check if the values have the same units', () => {
  test.each([
    ['vw & px', ['vw', 'px'], false],
    ['rem & rem', ['rem', 'rem'], 'rem'],
    ['px & rem & vw', ['px', 'rem', 'vw'], false],
    ['rem & em', ['rem', 'em'], false],
    ['none & none', [undefined, undefined], false],
  ])(
    '%O',
    (description, parameters, expected) => {
      const [aUnits, bUnits] = parameters;
      expect(haveSameUnits(aUnits, bUnits)).toEqual(expected);
    },
  );
});
