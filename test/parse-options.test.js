const { parseOptions } = require('../lib/parse-options');

/**
 * Test CSS option value collection and normalization.
 */
describe('Test good option values', () => {
  test('full values', () => {
    expect(parseOptions(['columns 12', 'gap 2rem / true', 'edge 2rem', 'site-max 90rem'])).toEqual({
      columns: 12, gap: '2rem', addGap: true, edge: '2rem', siteMax: '90rem',
    });
  });

  test('columns', () => {
    expect(parseOptions(['columns 12'])).toEqual({
      columns: 12,
    });
  });

  test('full gap (addGap true)', () => {
    expect(parseOptions(['gap 2rem / true'])).toEqual({
      gap: '2rem', addGap: true,
    });
  });

  test('full gap (addGap false)', () => {
    expect(parseOptions(['gap 2rem / false'])).toEqual({
      gap: '2rem', addGap: false,
    });
  });

  test('gap-only', () => {
    expect(parseOptions(['gap 2rem'])).toEqual({
      gap: '2rem',
    });
  });

  test('edge', () => {
    expect(parseOptions(['edge 2rem'])).toEqual({
      edge: '2rem',
    });
  });

  test('site-max', () => {
    expect(parseOptions(['site-max 90rem'])).toEqual({
      siteMax: '90rem',
    });
  });

  test('siteMax', () => {
    expect(parseOptions(['siteMax 90rem'])).toEqual({
      siteMax: '90rem',
    });
  });
});
