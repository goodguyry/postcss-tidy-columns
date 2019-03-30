const valuesHaveSameUnits = require('./valuesHaveSameUnits');

/**
 * Check array values for like units.
 */
describe('Check array values for like units', () => {
  test('Finds values have the same units', () => {
    expect(valuesHaveSameUnits(['1000px', '600px', '400px']))
      .toEqual(true);
  });

  test('Finds values have different units', () => {
    expect(valuesHaveSameUnits(['1000px', '60rem', '400px']))
      .toEqual(false);
  });
});
