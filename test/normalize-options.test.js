const { normalizeOptions } = require('../lib/normalize-options');

/**
 * Test expected option values after normalization.
 */
describe('Test option validation', () => {
  test('omit invalid or `none` values', () => {
    expect(normalizeOptions({
      columns: 'none', gap: 0, edge: 2, siteMax: '90',
    })).toEqual({});
  });

  test('`addGap` String to Boolean', () => {
    expect(normalizeOptions({
      addGap: 'false',
    })).toEqual({
      addGap: false,
    });
  });

  test('`columns` String to Number', () => {
    expect(normalizeOptions({
      columns: '12',
    })).toEqual({
      columns: 12,
    });
  });
});
