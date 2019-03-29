const parseOptions = require('./parseOptions');

describe('Parse and compile CSS @tidy at-rule parameters.', () => {
  test('Collects all values as expected', () => {
    expect(parseOptions(['columns 12', 'gap 2rem', 'edge 2rem', 'site-max 90rem']))
      .toEqual({
        columns: 12,
        gap: '2rem',
        edge: '2rem',
        siteMax: '90rem',
      });
  });

  test('Parses `columns` value as a number', () => {
    expect(parseOptions(['columns 12']))
      .toEqual({ columns: 12 });
  });

  test('Collects hyphenated `site-max` value', () => {
    expect(parseOptions(['site-max 90rem']))
      .toEqual({ siteMax: '90rem' });
  });

  test('Collects camelCased `siteMax` value', () => {
    expect(parseOptions(['siteMax 90rem']))
      .toEqual({ siteMax: '90rem' });
  });
});
