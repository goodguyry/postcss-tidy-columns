const handleCustomProperties = require('../handleCustomProperties');

const rule = {
  error: () => false,
};

/**
 * Reject usage of CSS Custom Properties in `@tidy site-max` rules.
 */
describe('Reject usage of CSS Custom Properties in `@tidy site-max` rules', () => {
  test(
    'Using a CSS Custom Property value for `site-max` throws an error',
    () => expect(() => {
      handleCustomProperties(rule, 'site-max var(--siteMax)');
    }).toThrow(),
  );

  test(
    'Using a CSS Custom Property value for `columns` does not throw an error',
    () => expect(() => {
      handleCustomProperties(rule, 'columns var(--cols)');
    }).not.toThrow(),
  );
});
