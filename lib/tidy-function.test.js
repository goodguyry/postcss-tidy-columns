/* eslint-disable max-len */
const { run } = require('../index.test.js');
const { typical } = require('../test/sharedConfigs');

describe('Test `tidy-offset` function replacement', () => {
  test(
    'Basic `tidy-offset()`',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      'div { margin-left: calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Basic `tidy-offset-full()`',
    () => run(
      'div { margin-left: tidy-offset-full(1); }',
      'div { margin-left: calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    '`tidy-offset()` inside calc()',
    () => run(
      'div { margin-left: calc(tidy-offset(3) + 20px); }',
      'div { margin-left: calc(((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) + 20px); }',
      typical,
    ),
  );

  test(
    'Multiple `tidy-offset()`s in a property value',
    () => run(
      'div { margin: 0 tidy-offset(3) 0 tidy-offset(1); }',
      'div { margin: 0 calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) 0 calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );
});

describe('Test `tidy-offset` function replacement', () => {
  test(
    'Basic `tidy-span()`',
    () => run(
      'div { width: tidy-span(1); }',
      'div { width: calc((100vw - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  test(
    'Basic `tidy-span-full()`',
    () => run(
      'div { max-width: tidy-span-full(1); }',
      'div { max-width: calc((90rem - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  test(
    '`tidy-span-full()` inside calc()',
    () => run(
      'div { max-width: calc(tidy-span-full(4) + 20px); }',
      'div { max-width: calc(((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 4) + 1.25rem * 3) + 20px); }',
      typical,
    ),
  );
});
