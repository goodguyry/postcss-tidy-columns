const { normalizeOptions, handleBreakpointConfigs } = require('./normalize-options');

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

  test('`columns` String to Number', () => {
    expect(normalizeOptions({
      columns: '12',
    }))
      .toEqual({ columns: 12 });
  });

  test('Single breakpoint', () => {
    expect(normalizeOptions({
      columns: 12,
      edge: '1rem',
      gap: '0.625rem',
      siteMax: '90rem',
      breakpoints: [
        {
          breakpoint: '48rem',
          gap: '1rem',
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
            edge: '1.25rem',
          },
        ],
        collectedBreakpointValues: [
          '48rem',
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

  test('Multiple breakpoints w/ zero overrides', () => {
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
          edge: 0,
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
            edge: 0,
          },
        ],
        collectedBreakpointValues: [
          '48rem',
          '64rem',
        ],
      });
  });
});

describe('Breakpoint validation and collection', () => {
  test('Breakpoint with no units', () => {
    expect(handleBreakpointConfigs([
      {
        breakpoint: 768,
        gap: '1rem',
        edge: '1.25rem',
      },
    ], {}))
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
    expect(handleBreakpointConfigs([
      {
        breakpoint: 1024,
        gap: '1.25rem',
      },
      {
        breakpoint: '768px',
        edge: '1.25rem',
      },
    ], {}))
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
});
