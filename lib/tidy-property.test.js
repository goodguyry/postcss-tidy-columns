/* eslint-disable max-len */
const { run } = require('../index.test.js');
const { typical } = require('../test/sharedConfigs');

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
});
