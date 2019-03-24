const run = require('../index.test.js');
const { typical, typicalWithBreakpoints } = require('../test/sharedConfigs');

/**
 * Test property replacements
 */
describe('Test `tidy-var` function replacement', () => {
  test(
    'Single `gap` value',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Single `edge` value',
    () => run(
      'div { padding-left: tidy-var(edge); }',
      'div { padding-left: 0.625rem; }',
      typical,
    ),
  );

  test(
    'Single `siteMax` value within breakpoint',
    () => run(
      'div { max-width: tidy-var(siteMax); }',
      'div { max-width: 90rem; }',
      typical,
    ),
  );

  test(
    'Multiple `gap` values',
    () => run(
      'div { margin: 0 tidy-var(gap) 0 tidy-var(gap); }',
      'div { margin: 0 1.25rem 0 1.25rem; }',
      typical,
    ),
  );

  test(
    'Mixed values',
    () => run(
      'div { padding: 0 tidy-var(edge) 0 tidy-var(gap); }',
      'div { padding: 0 0.625rem 0 1.25rem; }',
      typical,
    ),
  );

  test(
    'Single-quoted value',
    () => run(
      "div { margin-left: tidy-var('gap'); }",
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Douple-quoted value',
    () => run(
      'div { margin-left: tidy-var("gap"); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'No option value',
    () => run(
      'div { margin-left: tidy-var(flurm); }',
      'div { margin-left: tidy-var(flurm); }',
      typical,
    ),
  );

  test(
    'Breakpoint matching',
    () => run(
      // eslint-disable-next-line max-len
      'div { margin-left: tidy-var(gap); } @media (min-width: 900px) { div { margin-left: tidy-var(gap); } }',
      'div { margin-left: 1.25rem; } @media (min-width: 900px) { div { margin-left: 0.625rem; } }',
      typicalWithBreakpoints,
    ),
  );
});
