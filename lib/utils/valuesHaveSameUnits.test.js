const valuesHaveSameUnits = require('./valuesHaveSameUnits');

describe('Values have same units', () => {
  test('Same units', () => {
    expect(valuesHaveSameUnits(['1000px', '600px', '400px']))
      .toEqual(true);
  });

  test('Different units', () => {
    expect(valuesHaveSameUnits(['1000px', '60rem', '400px']))
      .toEqual(false);
  });
});
