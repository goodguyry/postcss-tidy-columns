const { run } = require('../test');
const postcss = require('postcss');
const tidyShorthandProperty = require('./tidy-shorthand-property');

/**
 * Create a test plugin to replace shorthand properties. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runShorthandTest = (input, output) => (
  run(input, output, {}, postcss.plugin(
    'shorthand-props-test',
    () => function process(root) {
      root.walkDecls((declaration) => {
        tidyShorthandProperty(declaration);
      });
    },
  ))
);

/**
 * Clean and trim shorthand property values.
 */
describe('The `tidy-column` shorthand property is replaced with the long-form equivalents', () => {
  test(
    'The `tidy-column` property is replaced as expected',
    () => runShorthandTest(
      'div { tidy-column: 1 / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'The left offset is ignored when the first value is `none`',
    () => runShorthandTest(
      'div { tidy-column: none / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-right: 3; }',
    ),
  );

  test(
    'A missing third argument to `tidy-column` applies the offset to both sides',
    () => runShorthandTest(
      'div { tidy-column: 1 / span 2; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});

describe('The `tidy-offset` shorthand property is replaced with the long-form equivalents', () => {
  test(
    'The `tidy-offset` property is replaced as expected',
    () => runShorthandTest(
      'div { tidy-offset: 1 / 3; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'The left offset is ignored when the first value is `none`',
    () => runShorthandTest(
      'div { tidy-offset: none / 3; }',
      'div { tidy-offset-right: 3; }',
    ),
  );

  test(
    'A missing second argument to `tidy-offset` applies the offset to both sides',
    () => runShorthandTest(
      'div { tidy-offset: 1; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});
