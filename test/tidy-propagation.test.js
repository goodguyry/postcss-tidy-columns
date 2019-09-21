/* eslint-disable max-len */
const postcss = require('postcss');
const run = require('.');
const Tidy = require('../Tidy');
const { typicalWithBreakpoints } = require('./sharedConfigs');
const { tidyPropagation } = require('../tidy-propagation');

/**
 * Create a test plugin to replace shorthand properties. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runShorthandTest = (input, output, options = {}) => (
  run(input, output, options, postcss.plugin(
    'shorthand-props-test',
    () => function process(root) {
      root.walkRules((rule) => {
        const tidy = new Tidy(rule, options);

        root.walkDecls((declaration) => {
          if (/!tidy/.test(declaration.value)) {
            // Pass in a mock Tidy object.
            tidyPropagation(declaration, tidy, root);
          }
        });
      });
    },
  ))
);

/**
 * Clean and trim shorthand property values.
 */
describe('The `!tidy` signals a declaration should be duplicated inside any configured breakpoints', () => {
  test(
    'A property declaration is duplicated as expected',
    () => runShorthandTest(
      'div { tidy-span: 3 !tidy; }',
      `div { tidy-span: 3; }
@media (min-width: 768px) {
 div { tidy-span: 3; } }
@media (min-width: 1024px) {
 div { tidy-span: 3; } }`,
      typicalWithBreakpoints,
    ),
  );

  test(
    'A function declaration is duplicated as expected',
    () => runShorthandTest(
      'div { width: calc(tidy-span(3) + 2rem) !tidy; }',
      `div { width: calc(tidy-span(3) + 2rem); }
@media (min-width: 768px) {
 div { width: calc(tidy-span(3) + 2rem); } }
@media (min-width: 1024px) {
 div { width: calc(tidy-span(3) + 2rem); } }`,
      typicalWithBreakpoints,
    ),
  );

  test(
    'A non-tidy declaration is duplicated as expected',
    () => runShorthandTest(
      'div { width: 14px !tidy; }',
      `div { width: 14px; }
@media (min-width: 768px) {
 div { width: 14px; } }
@media (min-width: 1024px) {
 div { width: 14px; } }`,
      typicalWithBreakpoints,
    ),
  );

  test(
    'A tidy declaration inside a media query is duplicated as expected',
    () => runShorthandTest(
      '@media (min-width: 768px) { div { tidy-span: 3 !tidy; } }',
      '@media (min-width: 768px) { div { tidy-span: 3; } } @media (min-width: 1024px) { div { tidy-span: 3; } }',
      typicalWithBreakpoints,
    ),
  );

  test(
    'Ignores declaration inside max-width media query',
    () => runShorthandTest(
      '@media (max-width: 768px) { div { tidy-span: 3 !tidy; } }',
      '@media (max-width: 768px) { div { tidy-span: 3; } }',
      typicalWithBreakpoints,
    ),
  );
});
