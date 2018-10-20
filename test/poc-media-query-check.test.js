const breakpointMatch = require('../lib/breakpoint-match');

describe('Find a breakpoint match: px', () => {
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

  test('Between breakpoint configs (min)', () => {
    expect(breakpointMatch('(min-width: 900px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Between breakpoint configs (max)', () => {
    expect(breakpointMatch('(max-width: 900px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Below lowest breakpoint config (min)', () => {
    expect(breakpointMatch('(min-width: 600px)', options))
      .toEqual(undefined);
  });

  test('Below lowest breakpoint config (max)', () => {
    expect(breakpointMatch('(max-width: 600px)', options))
      .toEqual(undefined);
  });

  test('Up-to breakpoint config', () => {
    expect(breakpointMatch('(max-width: 1439px)', options))
      .toEqual({ breakpoint: '1024px', gap: '1rem' });
  });

  test('Up-to lowest breakpoint config', () => {
    expect(breakpointMatch('(max-width: 767px)', options))
      .toEqual(undefined);
  });

  test('Between breakpoint configs (min-max)', () => {
    expect(breakpointMatch('(min-width: 768px) and (max-width: 1023px)', options))
      .toEqual({ breakpoint: '768px', gap: '0.625rem' });
  });

  test('Spanning two breakpoint configs (min-max)', () => {
    expect(breakpointMatch('(min-width: 768px) and (max-width: 1439px)', options))
      .toEqual(undefined);
  });
});
