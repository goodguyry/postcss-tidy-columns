const varPattern = require('./varPattern');

/**
 * Pattern to match CSS Custom Properties.
 */
describe('Pattern to match CSS Custom Properties', () => {
  test(
    'Matches a custom property insertion',
    () => expect(varPattern.test('var(--the_123-propertyNAME)')).toBeTruthy(),
  );

  test(
    'Ignores a simple property assignment',
    () => expect(varPattern.test('--the-variable name')).toBeFalsy(),
  );
});
