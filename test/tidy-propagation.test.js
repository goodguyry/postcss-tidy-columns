/* eslint-disable max-len, no-useless-escape */
const postcss = require('postcss');
const run = require('.');
const Tidy = require('../Tidy');
const { typicalWithBreakpoints } = require('./sharedConfigs');
const { tidyPropagation, getSiteMax } = require('../tidy-propagation');

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
    'A property declaration with escaped ! (\!tidy) is duplicated as expected',
    () => runShorthandTest(
      'div { tidy-span: 3 \!tidy; }',
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
 div { width: calc(tidy-span(3) + 2rem); } }
@media (min-width: 90rem) {
 div { width: calc(tidy-span-full(3) + 2rem); } }`,
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

  test(
    'Adds tidy-offset-full() when a !tidy declaration contains tidy-offset()',
    () => runShorthandTest(
      'div { width: calc(tidy-offset(3) + 2rem) !tidy; }',
      `div { width: calc(tidy-offset(3) + 2rem); }
@media (min-width: 768px) {
 div { width: calc(tidy-offset(3) + 2rem); } }
@media (min-width: 1024px) {
 div { width: calc(tidy-offset(3) + 2rem); } }
@media (min-width: 90rem) {
 div { width: calc(tidy-offset-full(3) + 2rem); } }`,
      typicalWithBreakpoints,
    ),
  );
});

describe('getSiteMax properly retrieves the relevant siteMax value', () => {
  test('Single siteMax in root is returned', () => {
    const options = { siteMax: '90rem' };
    expect(getSiteMax(options)).toEqual('90rem');
  });

  test('Single siteMax in a breakpoint', () => {
    const options = {
      breakpoints: {
        '100px': {
          siteMax: '64rem',
        },
      },
    };
    expect(getSiteMax(options)).toEqual('64rem');
  });

  test('Multiple siteMax values; only the last is returned', () => {
    const options = {
      siteMax: '20rem',
      breakpoints: {
        '100px': {
          siteMax: '64rem',
        },
        '900px': {
          siteMax: '90rem',
        },
      },
    };
    expect(getSiteMax(options)).toEqual('90rem');
  });

  test('Single siteMax value returned, with breakpoints ignored', () => {
    const options = {
      siteMax: '20rem',
      breakpoints: {
        '100px': {
          columns: 12,
        },
        '900px': {
          gap: '1.25rem',
        },
      },
    };
    expect(getSiteMax(options)).toEqual('20rem');
  });

  test('No siteMax to be found', () => {
    expect(getSiteMax({})).toBeFalsy();
  });
});
