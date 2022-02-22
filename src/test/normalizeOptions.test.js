const { normalizeOptions, LENGTH_REGEX } = require('../normalizeOptions');

/**
 * Nomalize config.
 */
describe('Normalize option value types', () => {
  test('Omits invalid option values', () => {
    expect(normalizeOptions({
      columns: 'none',
      gap: '10vw',
      edge: 2,
      max: '90',
      base: 'px',
    }))
      .toEqual({});
  });

  test('Converts a string numerical value to a number', () => {
    expect(normalizeOptions({
      columns: '12',
    }))
      .toEqual({ columns: 12 });
  });
});

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 */
describe('Matches CSS length values of the supported unit values (px, em, rem)', () => {
  test.each([
    [
      '90rem',
      ['90rem', 'rem'],
    ],
    [
      '20px',
      ['20px', 'px'],
    ],
    [
      '4em',
      ['4em', 'em'],
    ],
    [
      '0.625rem',
      ['0.625rem', 'rem'],
    ],
    [
      '0',
      ['0', null],
    ],
  ])(
    'Correctly matches length values with supported units: %s',
    (input, expected) => {
      expect(LENGTH_REGEX.test(input)).toBeTruthy();
      // Wrapped in JSON.stringify() to work around Jest bug.
      expect(JSON.stringify(input.match(LENGTH_REGEX))).toEqual(JSON.stringify(expected));
    },
  );

  test.each([
    '90vw',
    '8vh',
    '7ch',
    '60 rem',
    '100',
  ])(
    'Ignores unsupported length values: %s',
    (input) => {
      expect(LENGTH_REGEX.test(input)).toBeFalsy();
      expect(input.match(LENGTH_REGEX)).toEqual(null);
    },
  );
});
