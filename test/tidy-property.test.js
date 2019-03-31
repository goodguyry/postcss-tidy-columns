/* eslint-disable max-len */
const run = require('.');
const { typical, edgeGap } = require('./sharedConfigs');
const { OFFSET_REGEX } = require('../tidy-property');

/**
 * Replace `tidy-*` properties.
 */
describe('The `tidy-offset-*` properties are replaced and their values reflect the expected options', () => {
  test(
    'The `tidy-offset-left` property is replaced.',
    () => run(
      'div { tidy-offset-left: 1; }',
      `div { margin-left: calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }
@media (min-width: 90rem) {
 div { margin-left: calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); } }`,
      typical,
    ),
  );

  test(
    'The `tidy-offset-right` property is replaced.',
    () => run(
      'div { tidy-offset-right: 2; }',
      `div { margin-right: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2); }
@media (min-width: 90rem) {
 div { margin-right: calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2); } }`,
      typical,
    ),
  );

  test(
    'Offsets without a `siteMax` do not output a media query',
    () => run(
      'div { tidy-offset-right: 2; }',
      'div { margin-right: calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px * 2); }',
      edgeGap,
    ),
  );
});

describe('The `tidy-span` property is replaced and its values reflect the expected options', () => {
  test(
    'The `tidy-span` property is replaced.',
    () => run(
      'div { tidy-span: 2; }',
      'div { width: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem); max-width: calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Spans without a `siteMax` do not output a `max-width` declaration',
    () => run(
      'div { tidy-span: 2; }',
      'div { width: calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px); }',
      edgeGap,
    ),
  );
});

/**
 * Pattern to match the `tidy-offset-*` property.
 */
describe('Pattern to match the `tidy-offset-*` property', () => {
  test.each([
    ['tidy-offset-left: 3', ['tidy-offset-left', 'left']],
    ['tidy-offset-right: 4', ['tidy-offset-right', 'right']],
  ])(
    'Matches %s',
    (input, expected) => {
      expect(OFFSET_REGEX.test(input)).toBeTruthy();
      expect(JSON.stringify(input.match(OFFSET_REGEX))).toEqual(JSON.stringify(expected));
    },
  );

  test.each([
    'tidy-span',
    'tidy-offset',
    'tidy-column',
    'tidy-offset-full(6)',
  ])(
    'Ignores %s',
    (input) => {
      expect(OFFSET_REGEX.test(input)).toBeFalsy();
      expect(input.match(OFFSET_REGEX)).toEqual(null);
    },
  );
});