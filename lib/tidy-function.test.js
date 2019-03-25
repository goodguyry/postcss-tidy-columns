/* eslint-disable max-len */
const { run } = require('../index.test.js');
const { typical } = require('../test/sharedConfigs');

/**
 * Test property replacements
 */
describe('Test `tidy-offset` function replacement', () => {
  test(
    'Single `tidy-offset()` value',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      'div { margin-left: calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Single `tidy-offset-full()` value',
    () => run(
      'div { margin-left: tidy-offset-full(1); }',
      'div { margin-left: calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

});

describe('Test `tidy-offset` function replacement', () => {
  test(
    'Single `tidy-span()` value',
    () => run(
      'div { width: tidy-span(1); }',
      'div { width: calc((100vw - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  test(
    'Single `tidy-span-full()` value',
    () => run(
      'div { max-width: tidy-span-full(1); }',
      'div { max-width: calc((90rem - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  // Negative offset
  // Negative offset-full
  // Negative span
  // Negative span-full
  // offset inside calc()
  // span inside calc()

  // Each of the above within breakpoints
});
