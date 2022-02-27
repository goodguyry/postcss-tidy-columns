/* eslint-disable max-len */
const { runWithWarnings } = require('..');
const tidyDeprecated = require('../../src/tidy-deprecated');

/**
 * A plugin to limit the scope to a single function: `tidyDeprecated`.
 */
const runShorthandTest = (input, output, options = {}) => (
  runWithWarnings(input, output, options, () => ({
    postcssPlugin: 'shorthand-props-test',
    Once(root, { result }) {
      root.walkDecls((declaration) => {
        tidyDeprecated(declaration, result);
      });
    },
  }))
);

/**
 * Replace `tidy-*` properties.
 */
describe('The `tidy-*` properties are replaced with declarations using the current API', () => {
  test(
    'The `tidy-column` property is replaced as expected',
    () => runShorthandTest(
      'div { tidy-column: 1 / span 2 / 3; }',
      'div { width: tidy-span(2); margin-left: tidy-offset(1); margin-right: tidy-offset(3); }',
    ),
  );

  test(
    'The `tidy-offset` property is replaced as expected',
    () => runShorthandTest(
      'div { tidy-offset: 1 / 3; }',
      'div { margin-left: tidy-offset(1); margin-right: tidy-offset(3); }',
    ),
  );

  test(
    'The `tidy-span` property is replaced by `width`.',
    () => runShorthandTest(
      'div { tidy-span: 2; }',
      'div { width: tidy-span(2); }',
    ),
  );

  test(
    'The `tidy-offset-left` property is replaced by `margin-left`.',
    () => runShorthandTest(
      'div { tidy-offset-left: 1; }',
      'div { margin-left: tidy-offset(1); }',
    ),
  );

  test(
    'The `tidy-offset-right` property is replaced by `margin-right`.',
    () => runShorthandTest(
      'div { tidy-offset-right: 2; }',
      'div { margin-right: tidy-offset(2); }',
    ),
  );
});
