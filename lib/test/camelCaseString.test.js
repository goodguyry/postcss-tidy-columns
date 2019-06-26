const camelCaseString = require('../camelCaseString');

/**
 * Camelcase the hyphenated property names.
 */
describe('Camelcase the hyphenated property names', () => {
  test.each([
    ['hyphenated-string', undefined, 'hyphenatedString'],
    ['percent%string', '%', 'percentString'],
  ])(
    'camelCases strings with a matching delimiter: %s',
    (input, delimiter, expected) => {
      expect(camelCaseString(input, delimiter)).toEqual(expected);
    },
  );

  test.each([
    ['underscored_string', undefined, 'underscored_string'],
  ])(
    'Ignores strings with no matching delimiter: %s',
    (input, delimiter, expected) => {
      expect(camelCaseString(input, delimiter)).toEqual(expected);
    },
  );
});
