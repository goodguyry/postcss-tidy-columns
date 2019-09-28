const {
  normalizeOptions,
  handleBreakpointConfigs,
  LENGTH_REGEX,
} = require('../normalizeOptions');

/**
 * Nomalize, collect and merge breakpoint configs.
 */
describe('Normalize option value types', () => {
  test('Omits invalid option values', () => {
    expect(normalizeOptions({
      columns: 'none', gap: '10vw', edge: 2, siteMax: '90',
    }))
      .toEqual({});
  });

  test('Converts a string numerical value to a number', () => {
    expect(normalizeOptions({
      columns: '12',
    }))
      .toEqual({ columns: 12 });
  });

  test('Collects options with one included breakpoint config', () => {
    expect(normalizeOptions({
      columns: 12,
      edge: '1rem',
      gap: '0.625rem',
      siteMax: '90rem',
      breakpoints: {
        '48rem': {
          gap: '1rem',
          edge: '1.25rem',
        },
      },
    }))
      .toEqual({
        columns: 12,
        edge: '1rem',
        gap: '0.625rem',
        siteMax: '90rem',
        breakpoints: {
          '48rem': {
            gap: '1rem',
            edge: '1.25rem',
          },
        },
      });
  });

  test('Collects and merges options with multiple breakpoint configs', () => {
    expect(normalizeOptions({
      columns: 12,
      edge: '1rem',
      gap: '0.625rem',
      siteMax: '90rem',
      breakpoints: {
        '48rem': {
          gap: '1rem',
        },
        '64rem': {
          edge: '1.25rem',
        },
      },
    }))
      .toEqual({
        columns: 12,
        edge: '1rem',
        gap: '0.625rem',
        siteMax: '90rem',
        breakpoints: {
          '48rem': {
            gap: '1rem',
          },
          '64rem': {
            gap: '1rem',
            edge: '1.25rem',
          },
        },
      });
  });
});

describe('Nomalize, collect and merge breakpoint configs', () => {
  test('Converts breakpoint value with no units to `px`', () => {
    expect(handleBreakpointConfigs({
      768: {
        gap: '1rem',
        edge: '1.25rem',
      },
    }, {}))
      .toEqual({
        breakpoints: {
          '768px': {
            gap: '1rem',
            edge: '1.25rem',
          },
        },
      });
  });

  test('Collects, merges, and sorts breakpoint values declared out-of-order', () => {
    expect(handleBreakpointConfigs({
      1024: {
        gap: '1.25rem',
      },
      '768px': {
        edge: '1.25rem',
      },
    }, {}))
      .toEqual({
        breakpoints: {
          '768px': {
            edge: '1.25rem',
          },
          '1024px': {
            gap: '1.25rem',
            edge: '1.25rem',
          },
        },
      });
  });

  test('Collects and merges breakpoint values with `0` overrrides', () => {
    expect(handleBreakpointConfigs({
      '48rem': {
        gap: '1rem',
      },
      '64rem': {
        edge: 0,
      },
    }, {}))
      .toEqual({
        breakpoints: {
          '48rem': {
            gap: '1rem',
          },
          '64rem': {
            gap: '1rem',
            edge: 0,
          },
        },
      });
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
      // https://github.com/facebook/jest/issues/5998
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
