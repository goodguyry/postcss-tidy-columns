const breakpointMatch = require('./breakpointMatch');

describe('Get options based on a matching breakpoint value.', () => {
  // Parsed options.
  const options = {
    breakpoints: [
      {
        breakpoint: '768px',
        gap: '0.625rem',
      },
      {
        breakpoint: '1024px',
        gap: '1rem',
      },
      {
        breakpoint: '1440px',
        gap: '1.25rem',
      },
    ],
    collectedBreakpointValues: [
      '768px',
      '1024px',
      '1440px',
    ],
  };

  test('Matches a min-width media query value between breakpoint values', () => {
    expect(breakpointMatch('(min-width: 900px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Matches a max-width media query value between breakpoint values', () => {
    expect(breakpointMatch('(max-width: 900px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Matches a complex media query between two breakpoint values', () => {
    expect(breakpointMatch('(min-width: 768px) and (max-width: 1023px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Ignores a min-width media query value with no matching breakpoint', () => {
    expect(breakpointMatch('(min-width: 600px)', options))
      .toEqual(undefined);
  });

  test('Ignores a max-width media query value with no matching breakpoint', () => {
    expect(breakpointMatch('(max-width: 600px)', options))
      .toEqual(undefined);
  });

  test('Ignores a complex media query spanning multiple breakpoint values', () => {
    expect(breakpointMatch('(min-width: 768px) and (max-width: 1439px)', options))
      .toEqual(undefined);
  });
});
