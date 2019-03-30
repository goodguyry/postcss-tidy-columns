const { strings, objectsByProperty } = require('../sort');

/**
 * Sort array of strings.
 */
describe('Sort array of strings', () => {
  test('Sorts multiple string values', () => {
    expect(['1000px', '600px', '400px'].sort(strings()))
      .toEqual(['400px', '600px', '1000px']);
  });

  test('Ignores a single string', () => {
    expect(['1024px'].sort(strings()))
      .toEqual(['1024px']);
  });

  test('Ignores an empty array', () => {
    expect([].sort(strings()))
      .toEqual([]);
  });
});

/**
 * Sort an array of objects by an object property.
 */
describe('Sort an array of objects by an object property', () => {
  test('Sorts an array of objects by property', () => {
    /* eslint-disable function-paren-newline */
    expect(
      [
        { breakpoint: '1000px', boo: 100 },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '400px', baz: 'zoo' },
      ].sort(objectsByProperty('breakpoint')))
      .toEqual([
        { breakpoint: '400px', baz: 'zoo' },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '1000px', boo: 100 },
      ]);
  });
});
