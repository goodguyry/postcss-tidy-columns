const { run } = require('../test');
const postcss = require('postcss');
const tidyShorthandProperty = require('./tidy-shorthand-property');

/**
 * Create a test plugin to replace shorthand properties. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const shorthandPropsPlugin = postcss.plugin(
  'shorthand-props-test',
  () => function process(root) {
    root.walkDecls((declaration) => {
      tidyShorthandProperty(declaration);
    });
  },
);

/**
 * Run the test plugin and return the output.
 */
const runShorthandTest = (input, output) => run(input, output, {}, shorthandPropsPlugin);

/**
 * Test shorthand property replacements.
 */
describe('Test `tidy-column` shorthand property replacement', () => {
  test(
    'All values',
    () => runShorthandTest(
      'div { tidy-column: 1 / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'First value `none`',
    () => runShorthandTest(
      'div { tidy-column: none / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-right: 3; }',
    ),
  );

  test(
    'Last value missing',
    () => runShorthandTest(
      'div { tidy-column: 1 / span 2; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});

describe('Test `tidy-offset` shorthand property replacement', () => {
  test(
    'All values',
    () => runShorthandTest(
      'div { tidy-offset: 1 / 3; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'First value `none`',
    () => runShorthandTest(
      'div { tidy-offset: none / 3; }',
      'div { tidy-offset-right: 3; }',
    ),
  );

  test(
    'Second value missing',
    () => runShorthandTest(
      'div { tidy-offset: 1; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});
