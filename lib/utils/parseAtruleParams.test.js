const parseAtruleParams = require('./parseAtruleParams');

describe('Parse media queries', () => {
  test('Basic: min-width', () => {
    expect(parseAtruleParams('(min-width: 100px)'))
      .toEqual([{ minMax: 'min', value: '100px' }]);
  });

  test('Basic: max-width', () => {
    expect(parseAtruleParams('(max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  test('Complex: min-width and max-width', () => {
    expect(parseAtruleParams('(min-width: 100px) and (max-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }]);
  });

  test('Complex: screen and min-width', () => {
    expect(parseAtruleParams('screen and (min-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '200px' }]);
  });

  test('Complex: screen and max-width', () => {
    expect(parseAtruleParams('screen and (max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  test('Complex: screen and min-width and max-width', () => {
    expect(parseAtruleParams('screen and (min-width: 100px) and (max-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }]);
  });

  test('Complex: screen and min-width (rem) and max-width (em)', () => {
    expect(parseAtruleParams('screen and (min-width: 10rem) and (max-width: 40em)'))
      .toEqual([{ minMax: 'min', value: '10rem' }, { minMax: 'max', value: '40em' }]);
  });

  test('Ignore screen and print', () => {
    expect(parseAtruleParams('screen and print'))
      .toEqual([]);
  });
});
