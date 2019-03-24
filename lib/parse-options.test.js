const { parseOptions } = require('./parse-options');

/**
 * Test CSS option value collection and normalization.
 */
describe('Test good option values', () => {
  test('full values', () => {
    expect(parseOptions(['columns 12', 'gap 2rem', 'edge 2rem', 'site-max 90rem']))
      .toEqual({
        columns: 12,
        gap: '2rem',
        edge: '2rem',
        siteMax: '90rem',
      });
  });

  test('columns', () => {
    expect(parseOptions(['columns 12']))
      .toEqual({ columns: 12 });
  });

  test('gap', () => {
    expect(parseOptions(['gap 2rem']))
      .toEqual({ gap: '2rem' });
  });

  test('edge', () => {
    expect(parseOptions(['edge 2rem']))
      .toEqual({ edge: '2rem' });
  });

  test('site-max', () => {
    expect(parseOptions(['site-max 90rem']))
      .toEqual({ siteMax: '90rem' });
  });

  test('siteMax', () => {
    expect(parseOptions(['siteMax 90rem']))
      .toEqual({ siteMax: '90rem' });
  });
});
