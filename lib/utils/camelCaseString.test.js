const camelCaseString = require('./camelCaseString');

describe('Strings should be camelCased as expected', () => {
  test('Hyphenated string with default delimiter', () => {
    expect(camelCaseString('hyphenated-string'))
      .toEqual('hyphenatedString');
  });

  test('Underscore-separated string with default delimiter', () => {
    expect(camelCaseString('underscored_string'))
      .toEqual('underscored_string');
  });

  test('String with custom delimiter', () => {
    expect(camelCaseString('percent%string', '%'))
      .toEqual('percentString');
  });
});
