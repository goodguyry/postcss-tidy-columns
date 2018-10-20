const valuesHaveSameUnits = require('../lib/utils/valuesHaveSameUnits');
const sortStrings = require('../lib/utils/sortStrings');
const parseAtRuleParams = require('../lib/utils/parseAtRuleParams');

describe('Values have same units', () => {
  test('Same units', () => {
      expect(
        valuesHaveSameUnits(['1000px', '600px', '400px'])
      ).toEqual(true);
    });

  test('Different units', () => {
      expect(
        valuesHaveSameUnits(['1000px', '60rem', '400px'])
      ).toEqual(false);
    });
});

describe('Sort breakpoints array', () => {
  test('Same units', () => {
      expect(
        sortStrings(['1000px', '600px', '400px'])
      ).toEqual(['400px', '600px', '1000px']);
    });

  test('Different units', () => {
      expect(
        sortStrings(['1000px', '60rem', '400px'])
      ).toEqual(false);
    });
});

describe('Parse media queries', () => {
  test('min-width', () => {
      expect(
        parseAtRuleParams('(min-width: 100px)')
      ).toEqual([{minMax: 'min', value: '100px'}]);
    });

  test('max-width', () => {
      expect(
        parseAtRuleParams('(max-width: 200px)')
      ).toEqual([{minMax: 'max', value: '200px'}]);
    });

  test('min-width and max-width', () => {
      expect(
        parseAtRuleParams('(min-width: 100px) and (max-width: 200px)')
      ).toEqual([{minMax: 'min', value: '100px'}, {minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 200px)')
      ).toEqual([{minMax: 'min', value: '200px'}]);
    });

  test('screen and max-width', () => {
      expect(
        parseAtRuleParams('screen and (max-width: 200px)')
      ).toEqual([{minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width and max-width', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 100px) and (max-width: 200px)')
      ).toEqual([{minMax: 'min', value: '100px'}, {minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width (rem) and max-width (em)', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 10rem) and (max-width: 40em)')
      ).toEqual([{minMax: 'min', value: '10rem'}, {minMax: 'max', value: '40em'}]);
    });

  test('screen and print', () => {
      expect(
        parseAtRuleParams('screen and print')
      ).toEqual([]);
    });
});
