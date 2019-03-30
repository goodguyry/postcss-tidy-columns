/* eslint-disable max-len */
const run = require('../test');
const { typical } = require('../test/sharedConfigs');

describe('The `tidy-offset` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-offset()` function',
    () => run(
      'div { margin-left: tidy-offset(1); }',
      'div { margin-left: calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-offset-full()` function',
    () => run(
      'div { margin-left: tidy-offset-full(1); }',
      'div { margin-left: calc(((90rem - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-offset()` function when inside a `calc()`` function',
    () => run(
      'div { margin-left: calc(tidy-offset(3) + 20px); }',
      'div { margin-left: calc(((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) + 20px); }',
      typical,
    ),
  );

  test(
    'Replaces multiple `tidy-offset()`s in the same property value',
    () => run(
      'div { margin: 0 tidy-offset(3) 0 tidy-offset(1); }',
      'div { margin: 0 calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) 0 calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem); }',
      typical,
    ),
  );
});

describe('The `tidy-span()` functions are replaced and their values reflect the expected options', () => {
  test(
    'Replaces the `tidy-span()` function',
    () => run(
      'div { width: tidy-span(1); }',
      'div { width: calc((100vw - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-span-full()` function',
    () => run(
      'div { max-width: tidy-span-full(1); }',
      'div { max-width: calc((90rem - 0.625rem * 2) / 12 - 1.1458rem); }',
      typical,
    ),
  );

  test(
    'Replaces the `tidy-span()` function when inside a `calc()`` function',
    () => run(
      'div { max-width: calc(tidy-span-full(4) + 20px); }',
      'div { max-width: calc(((((90rem - 0.625rem * 2) / 12 - 1.1458rem) * 4) + 1.25rem * 3) + 20px); }',
      typical,
    ),
  );
});
