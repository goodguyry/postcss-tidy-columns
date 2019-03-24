const postcss = require('postcss');
const tidyShorthandProperty = require('./tidy-shorthand-property');

/**
 * Create a test plugin to replace shorthand properties.
 */
const plugin = postcss.plugin(
  'shorthand-props-test',
  () => function process(root) {
    root.walkDecls(/^tidy-(column|offset)$/, (declaration) => {
      tidyShorthandProperty(declaration);
    });
  },
);

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const run = (input, output) => postcss([plugin()])
  .process(input, { from: undefined })
  .then((result) => {
    expect(result.css).toEqual(output);
    expect(result.warnings().length).toBe(0);
  });

/**
 * Test shorthand property replacements
 */
describe('Test `tidy-column` shorthand property replacement', () => {
  test(
    'All values',
    () => run(
      'div { tidy-column: 1 / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'First value `none`',
    () => run(
      'div { tidy-column: none / span 2 / 3; }',
      'div { tidy-span: 2; tidy-offset-right: 3; }',
    ),
  );

  test(
    'Last value missing',
    () => run(
      'div { tidy-column: 1 / span 2; }',
      'div { tidy-span: 2; tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});

describe('Test `tidy-offset` shorthand property replacement', () => {
  test(
    'All values',
    () => run(
      'div { tidy-offset: 1 / 3; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 3; }',
    ),
  );

  test(
    'First value `none`',
    () => run(
      'div { tidy-offset: none / 3; }',
      'div { tidy-offset-right: 3; }',
    ),
  );

  test(
    'Second value missing',
    () => run(
      'div { tidy-offset: 1; }',
      'div { tidy-offset-left: 1; tidy-offset-right: 1; }',
    ),
  );
});
