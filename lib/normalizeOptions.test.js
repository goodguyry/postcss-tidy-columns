const { normalizeOptions, handleBreakpointConfigs } = require('./normalizeOptions');

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

  test('Collects and merges options with multiple breakpoint configs', () => {
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

describe('Nomalize, collect and merge breakpoint configs', () => {
  test('Converts breakpoint value with no units to `px`', () => {
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

  test('Collects, merges, and sorts breakpoint values declared out-of-order', () => {
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

  test('Collects and merges breakpoint values with `0` overrrides', () => {
    expect(handleBreakpointConfigs([
      {
        breakpoint: '48rem',
        gap: '1rem',
      },
      {
        breakpoint: '64rem',
        edge: 0,
      },
    ], {}))
      .toEqual({
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
