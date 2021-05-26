/* eslint-disable max-len */
const run = require('.');
const { typical, edgeGap, allValues } = require('./sharedConfigs');
const { OFFSET_REGEX } = require('../tidy-property');

/**
 * Replace `tidy-*` properties.
 */
describe('The `tidy-offset-*` properties are replaced and their values reflect the expected options', () => {
  test(
    'The `tidy-offset-left` property is replaced.',
    () => run(
      'div { tidy-offset-left: 1; }',
      // calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      // calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)
      `div { margin-left: calc(8.3333vw + 0rem); }
@media (min-width: 90rem) {
 div { margin-left: 7.5rem; } }`,
      typical,
    ),
  );

  test(
    'The `tidy-offset-right` property is replaced.',
    () => run(
      'div { tidy-offset-right: 2; }',
      // calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2)
      // calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2)
      `div { margin-right: calc(16.6667vw + 0.0001rem); }
@media (min-width: 90rem) {
 div { margin-right: 15.0001rem; } }`,
      typical,
    ),
  );

  test(
    'Offsets without a `siteMax` do not output a media query',
    () => run(
      'div { tidy-offset-right: 2; }',
      // calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px * 2)
      'div { margin-right: calc(16.6667vw - 0.3333rem + 1.6666px); }',
      edgeGap,
    ),
  );

  test(
    'Maintains `tidy-offset-right` input as a /* comment */',
    () => run(
      'div { tidy-offset-right: 2; }',
      'div { /* tidy-offset-right: 2 */ margin-right: calc(16.6667vw - 0.3333rem + 1.6666px); }',
      { ...edgeGap, debug: true },
    ),
  );
});

describe('The `tidy-span` property is replaced and its values reflect the expected options', () => {
  test(
    'The `tidy-span` property is replaced.',
    () => run(
      'div { tidy-span: 2; }',
      // calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem)
      // calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem)
      'div { width: calc(16.6667vw - 1.2499rem); max-width: 13.7501rem; }',
      typical,
    ),
  );

  test(
    'Spans without a `siteMax` do not output a `max-width` declaration',
    () => run(
      'div { tidy-span: 2; }',
      // calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px)
      'div { width: calc(16.6667vw - 0.3333rem - 8.3334px); }',
      edgeGap,
    ),
  );

  test(
    'The `tidy-span` property is not influenced by other declarations',
    () => run(
      // calc(((((100vw - 32px * 2) / 16 - 0.5859rem) * 10) + 0.625rem * 10) + 32px)
      // calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)
      // calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)
      'div { margin-left: calc(tidy-offset(10) + tidy-var(edge)); tidy-span: 2; }',
      'div { margin-left: calc((62.5vw - 40px + 0.391rem) + 32px); width: calc(12.5vw - 8px - 0.5468rem); max-width: calc(8.8282rem - 8px); }',
      allValues,
    ),
  );

  test(
    'Maintains `tidy-span` input as a /* comment */',
    () => run(
      'div { tidy-span: 2; }',
      // calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px)
      'div { /* tidy-span: 2 */ width: calc(16.6667vw - 0.3333rem - 8.3334px); }',
      { ...edgeGap, debug: true },
    ),
  );

  test(
    'Maintains `tidy-span` input as a /* comment */ via `@tidy debug` atRule',
    () => run(
      'div { @tidy debug true; tidy-span: 2; }',
      // calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 2) + 10px)
      'div { /* tidy-span: 2 */ width: calc(16.6667vw - 0.3333rem - 8.3334px); }',
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
      // Wrapped in JSON.stringify() to work around Jest bug.
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
