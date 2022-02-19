const handleCustomProperties = require('../handleCustomProperties');

const rule = {
  error: () => false,
};

/**
 * Reject usage of CSS Custom Properties in `@tidy max` rules.
 */
describe('Reject usage of CSS Custom Properties in `@tidy max` rules', () => {
  // @todo Make sure this doesn't fail.
  test(
    'Using a CSS Custom Property value for `max` throws an error',
    () => expect(() => {
      handleCustomProperties(rule, 'max var(--site-max)');
    }).toThrow(),
  );

  test(
    'Using a CSS Custom Property value for `columns` does not throw an error',
    () => expect(() => {
      handleCustomProperties(rule, 'columns var(--cols)');
    }).not.toThrow(),
  );
});
