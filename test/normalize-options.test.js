const { normalizeOptions } = require('../lib/normalize-options');

/**
 * Test expected option values after normalization.
 */
describe('Test option validation', () => {
  test('omit invalid values', () => {
    expect(normalizeOptions({
      columns: 'none', gap: '10vw', edge: 2, siteMax: '90',
    })).toEqual({});
  });

  test('`columns` String to Number', () => {
    expect(normalizeOptions({
      columns: '12',
    })).toEqual({
      columns: 12,
    });
  });
});
