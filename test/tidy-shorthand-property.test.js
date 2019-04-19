const run = require('.');
const postcss = require('postcss');
const {
  tidyShorthandProperty,
  COLUMNS_REGEX,
  OFFSET_REGEX,
} = require('../tidy-shorthand-property');

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

  test(
    'A single value applies to the span and both offsets',
    () => runShorthandTest(
      'div { tidy-column: 3; }',
      'div { tidy-span: 3; tidy-offset-left: 3; tidy-offset-right: 3; }',
    ),
  );
});

/**
 * Matches valid tidy-column shorthand values.
 */
describe('Matches valid tidy-column shorthand values', () => {
  test.each([
    [
      '2 / span 3 / 1',
      ['2 / span 3 / 1', '2', 'span 3', '1'],
    ],
    [
      '1 / span 6',
      ['1 / span 6', '1', 'span 6', undefined],
    ],
    [
      '3',
      ['3', '3', undefined, undefined],
    ],
    [
      '0 / span 2 / 1',
      ['0 / span 2 / 1', '0', 'span 2', '1'],
    ],
    [
      'none / span 5',
      ['none / span 5', 'none', 'span 5', undefined],
    ],
    [
      '2 / span 1 / none',
      ['2 / span 1 / none', '2', 'span 1', 'none'],
    ],
    [
      'none / span 5 / none',
      ['none / span 5 / none', 'none', 'span 5', 'none'],
    ],
    [
      '0 / span 4 / none',
      ['0 / span 4 / none', '0', 'span 4', 'none'],
    ],
    [
      '-2 / span 3.75 / 1',
      ['-2 / span 3.75 / 1', '-2', 'span 3.75', '1'],
    ],
  ])(
    'Matches tidy-column: %s',
    (input, expected) => {
      expect(COLUMNS_REGEX.test(input)).toBeTruthy();
      expect(JSON.stringify(input.match(COLUMNS_REGEX))).toEqual(JSON.stringify(expected));
    },
  );
});

/**
 * Matches valid tidy-offset shorthand values.
 */
describe('Matches valid tidy-offset shorthand values', () => {
  test.each([
    [
      '2 / 1',
      ['2 / 1', '2', '1'],
    ],
    [
      '1',
      ['1', '1', null],
    ],
    [
      'none / 3',
      ['none / 3', 'none', '3'],
    ],
    [
      '2 / none',
      ['2 / none', '2', 'none'],
    ],
    [
      '-2 / 1.5',
      ['-2 / 1.5', '-2', '1.5'],
    ],
  ])(
    'Matches tidy-offset: %s',
    (input, expected) => {
      expect(OFFSET_REGEX.test(input)).toBeTruthy();
      expect(JSON.stringify(input.match(OFFSET_REGEX))).toEqual(JSON.stringify(expected));
    },
  );
});
