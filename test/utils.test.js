const valuesHaveSameUnits = require('../lib/utils/valuesHaveSameUnits');
const { sortStrings, sortObjectsByProperty } = require('../lib/utils/sort');
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
  test('Same units', () => {
    expect(sortStrings(['1000px', '600px', '400px']))
      .toEqual(['400px', '600px', '1000px']);
  });

  test('Different units', () => {
    expect(sortStrings(['1000px', '60rem', '400px']))
      .toEqual(false);
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
      sortObjectsByProperty(
        [{ breakpoint: '1000px' }, { breakpoint: '600px' }, { breakpoint: '400px' }],
        'breakpoint',
      ),
    )
      .toEqual([{ breakpoint: '400px' }, { breakpoint: '600px' }, { breakpoint: '1000px' }]);
  });
});
