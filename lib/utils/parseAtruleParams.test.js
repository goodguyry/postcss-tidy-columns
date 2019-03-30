const parseAtruleParams = require('./parseAtruleParams');

/**
 * Parse AtRule params.
 */
describe('Collects attributes from media query parameters', () => {
  test('Collects a basic `min-width` media query', () => {
    expect(parseAtruleParams('(min-width: 100px)'))
      .toEqual([{ minMax: 'min', value: '100px' }]);
  });

  test('Collects a basic `max-width` media query', () => {
    expect(parseAtruleParams('(max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  test('Collects a complex `min-width and max-width` media query', () => {
    expect(parseAtruleParams('(min-width: 100px) and (max-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }]);
  });

  test('Collects a complex `screen and min-width` media query', () => {
    expect(parseAtruleParams('screen and (min-width: 200px)'))
      .toEqual([{ minMax: 'min', value: '200px' }]);
  });

  test('Collects a complex `screen and max-width` media query', () => {
    expect(parseAtruleParams('screen and (max-width: 200px)'))
      .toEqual([{ minMax: 'max', value: '200px' }]);
  });

  // eslint-disable-next-line max-len
  test('Collects a complex `screen and min-width and max-width` media query', () => {
    expect(parseAtruleParams('screen and (min-width: 10rem) and (max-width: 40em)'))
      .toEqual([{ minMax: 'min', value: '10rem' }, { minMax: 'max', value: '40em' }]);
  });

  test('Ignores a `screen and print` media query', () => {
    expect(parseAtruleParams('screen and print'))
      .toEqual([]);
  });
});
