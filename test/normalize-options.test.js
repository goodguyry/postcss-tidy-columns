const { normalizeOptions } = require('../lib/normalize-options');

/**
 * Test expected option values after normalization.
 */
describe('Test option validation', () => {
  test('omit invalid values', () => {
    expect(normalizeOptions({
      columns: 'none', gap: '10vw', edge: 2, siteMax: '90',
    }))
      .toEqual({});
  });

  test('`addGap` String to Boolean', () => {
    expect(normalizeOptions({
      addGap: 'false',
    }))
      .toEqual({ addGap: false });
  });

  test('`columns` String to Number', () => {
    expect(normalizeOptions({
      columns: '12',
    }))
      .toEqual({ columns: 12 });
  });

  test('Breakpoint with no units', () => {
    expect(normalizeOptions({
      breakpoints: [
        {
          breakpoint: 768,
          gap: '1rem',
          edge: '1.25rem',
        },
      ],
    }))
      .toEqual({
        breakpoints: [
          {
            breakpoint: '768px',
            gap: '1rem',
            edge: '1.25rem',
          },
        ],
        collectedBreakpointValues: [
          '768px',
        ],
      });
  });

  test('Multiple breakpoints (unsorted)', () => {
    expect(normalizeOptions({
      breakpoints: [
        {
          breakpoint: 1024,
          gap: '1.25rem',
        },
        {
          breakpoint: '768px',
          edge: '1.25rem',
        },
      ],
    }))
      .toEqual({
        breakpoints: [
          {
            breakpoint: '768px',
            edge: '1.25rem',
          },
          {
            breakpoint: '1024px',
            gap: '1.25rem',
            edge: '1.25rem',
          },
        ],
        collectedBreakpointValues: [
          '768px',
          '1024px',
        ],
      });
  });

  test('Multiple breakpoints', () => {
    expect(normalizeOptions({
      columns: 12,
      edge: '1rem',
      gap: '0.625rem',
      siteMax: '90rem',
      breakpoints: [
        {
          breakpoint: '48rem',
          gap: '1rem',
        },
        {
          breakpoint: '64rem',
          edge: '1.25rem',
        },
      ],
    }))
      .toEqual({
        columns: 12,
        edge: '1rem',
        gap: '0.625rem',
        siteMax: '90rem',
        breakpoints: [
          {
            breakpoint: '48rem',
            gap: '1rem',
          },
          {
            breakpoint: '64rem',
            gap: '1rem',
            edge: '1.25rem',
          },
        ],
        collectedBreakpointValues: [
          '48rem',
          '64rem',
        ],
      });
  });
});
