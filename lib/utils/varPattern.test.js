const varPattern = require('./varPattern');

describe('RegEx for matching CSS Custom Property var() functions', () => {
  test(
    'The RegEx pattern matches a custom property insertion',
    () => expect(varPattern.test('var(--the_123-propertyNAME)')).toBeTruthy(),
  );

  test(
    'The RegEx pattern does not match a simple property assignment',
    () => expect(varPattern.test('--the-variable name')).toBeFalsy(),
  );
});
