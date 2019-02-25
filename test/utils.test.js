const valuesHaveSameUnits = require('../lib/utils/valuesHaveSameUnits');
const { strings, objectsByProperty } = require('../lib/utils/sort');
const parseAtruleParams = require('../lib/utils/parseAtruleParams');
const compareStrings = require('../lib/utils/compareStrings');

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

describe('Sort breakpoints array', () => {
  test('Multiple values', () => {
    expect(['1000px', '600px', '400px'].sort(strings()))
      .toEqual(['400px', '600px', '1000px']);
  });

  test('Single value', () => {
    expect(['1024px'].sort(strings()))
      .toEqual(['1024px']);
  });

  test('No values', () => {
    expect([].sort(strings()))
      .toEqual([]);
  });
});

describe('Parse media queries', () => {
  test('min-width', () => {
    expect(parseAtruleParams('(min-width: 100px)'))
      .toEqual([{ minMax: 'min', value: '100px' }]);
  });

  test('max-width', () => {
    expect(parseAtruleParams('(max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  test('min-width and max-width', () => {
    expect(parseAtruleParams('(min-width: 100px) and (max-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }]);
  });

  test('screen and min-width', () => {
    expect(parseAtruleParams('screen and (min-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '200px' }]);
  });

  test('screen and max-width', () => {
    expect(parseAtruleParams('screen and (max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  test('screen and min-width and max-width', () => {
    expect(parseAtruleParams('screen and (min-width: 100px) and (max-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }]);
  });

  test('screen and min-width (rem) and max-width (em)', () => {
    expect(parseAtruleParams('screen and (min-width: 10rem) and (max-width: 40em)'))
      .toEqual([{ minMax: 'min', value: '10rem' }, { minMax: 'max', value: '40em' }]);
  });

  test('screen and print', () => {
    expect(parseAtruleParams('screen and print'))
      .toEqual([]);
  });
});

describe('Compare strings', () => {
  test('Reference after compare', () => {
    expect(compareStrings('1000px', '600px'))
      .toEqual(1);
  });

  test('Reference and compare are same', () => {
    expect(compareStrings('600px', '600px'))
      .toEqual(0);
  });

  test('Reference before compare', () => {
    expect(compareStrings('400px', '1000px'))
      .toEqual(-1);
  });
});

describe('Sort Objects', () => {
  test('Test one', () => {
    /* eslint-disable function-paren-newline */
    expect(
      [
        { breakpoint: '1000px', boo: 100 },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '400px', baz: 'zoo' },
      ].sort(objectsByProperty('breakpoint')))
      .toEqual([
        { breakpoint: '400px', baz: 'zoo' },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '1000px', boo: 100 },
      ]);
  });
});
