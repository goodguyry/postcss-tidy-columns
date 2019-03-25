/* eslint-disable max-len */
const run = require('../index.test.js');
const { typical, typicalWithBreakpoints } = require('../test/sharedConfigs');

describe('Test `tidy-offset` property replacement', () => {
  test(
    'Basic `tidy-offset-left`',
    () => run(
      'div { tidy-offset-left: 1; }',
      `div { margin-left: calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }
@media (min-width: 90rem) {
 div { margin-left: calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); } }`,
      typical,
    ),
  );

  test(
    'Basic `tidy-offset-right`',
    () => run(
      'div { tidy-offset-right: 2; }',
      `div { margin-right: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2); }
@media (min-width: 90rem) {
 div { margin-right: calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2); } }`,
      typical,
    ),
  );

  test(
    'Negative `tidy-offset-left`',
    () => run(
      'div { tidy-offset-left: -3; }',
      `div { margin-left: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * -3) + 1.25rem * -3); }
@media (min-width: 90rem) {
 div { margin-left: calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * -3) + 1.25rem * -3); } }`,
      typical,
    ),
  );

  test(
    '`tidy-offset-left` w/ no siteMax',
    () => run(
      'div { tidy-offset-left: 4; }',
      'div { margin-left: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 4) + 1.25rem * 4); }',
      typicalWithBreakpoints,
    ),
  );

  test(
    '`tidy-offset-right` w/ breakpoint siteMax',
    () => run(
      '@media (min-width: 1024px) { div { tidy-offset-right: 6; } }',
      '@media (min-width: 1024px) { div { margin-right: calc((((100vw - 0.625rem * 2) / 12 - 0.5729rem) * 6) + 0.625rem * 6); } } @media (min-width: 90rem) { div { margin-right: calc((((90rem - 0.625rem * 2) / 12 - 0.5729rem) * 6) + 0.625rem * 6); } }',
      typicalWithBreakpoints,
    ),
  );
});

describe('Test `tidy-span` property replacement', () => {
  test(
    'Basic `tidy-span`',
    () => run(
      'div { tidy-span: 2; }',
      'div { width: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem); max-width: calc((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem); }',
      typical,
    ),
  );

  test(
    '`tidy-span` w/ no `siteMax` option',
    () => run(
      'div { tidy-span: 2; }',
      'div { width: calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem); }',
      typicalWithBreakpoints,
    ),
  );

  test(
    '`tidy-span` w/ breakpoint `siteMax` option',
    () => run(
      '@media (min-width: 1024px) { div { tidy-span: 2; } }',
      '@media (min-width: 1024px) { div { width: calc((((100vw - 0.625rem * 2) / 12 - 0.5729rem) * 2) + 0.625rem); max-width: calc((((90rem - 0.625rem * 2) / 12 - 0.5729rem) * 2) + 0.625rem); } }',
      typicalWithBreakpoints,
    ),
  );
});
