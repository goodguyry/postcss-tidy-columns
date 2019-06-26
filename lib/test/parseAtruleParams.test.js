const { parseAtruleParams, WIDTH_REGEX } = require('../parseAtruleParams');

/**
 * Parse AtRule params.
 */
describe('Collects attributes from media query parameters', () => {
  test.each([
    [
      '(min-width: 100px)',
      [{ minMax: 'min', value: '100px' }],
    ],
    [
      '(max-width: 200px)',
      [{ minMax: 'max', value: '200px' }],
    ],
    [
      '(min-width: 100px) and (max-width: 200px)',
      [{ minMax: 'min', value: '100px' }, { minMax: 'max', value: '200px' }],
    ],
    [
      'screen and (min-width: 200px)',
      [{ minMax: 'min', value: '200px' }],
    ],
    [
      'screen and (max-width: 200px)',
      [{ minMax: 'max', value: '200px' }],
    ],
    [
      'screen and (min-width: 10rem) and (max-width: 40em)',
      [{ minMax: 'min', value: '10rem' }, { minMax: 'max', value: '40em' }],
    ],
  ])(
    'Matches and parses: %s',
    (input, expected) => {
      expect(WIDTH_REGEX.test(input)).toBeTruthy();
      expect(parseAtruleParams(input)).toEqual(expected);
    },
  );

  test.each([
    'screen and print',
    'print',
    'screen',
    'speech',
    'screen and (min-aspect-ratio: 2/1)',
    '(max-aspect-ratio: 2/1) and speech',
    'print and (orientation: portrait)',
  ])(
    'Ignores: %s',
    (input) => {
      expect(WIDTH_REGEX.test(input)).toBeFalsy();
      expect(parseAtruleParams(input)).toHaveLength(0);
    },
  );
});
