const camelCaseString = require('./camelCaseString');

/**
 * Camelcase the hyphenated property names.
 */
describe('Camelcase the hyphenated property names', () => {
  test('Camelcase a hyphenated string with default delimiter', () => {
    expect(camelCaseString('hyphenated-string'))
      .toEqual('hyphenatedString');
  });

  test('Ignores an underscore-separated string with default delimiter', () => {
    expect(camelCaseString('underscored_string'))
      .toEqual('underscored_string');
  });

  test('Camelcase a string with custom delimiter', () => {
    expect(camelCaseString('percent%string', '%'))
      .toEqual('percentString');
  });
});
