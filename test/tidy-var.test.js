const plugin = require('../');
const postcss = require('postcss');

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const run = (input, output) => (
  postcss([
    plugin({
      columns: 12,
      gap: '1.25rem',
      edge: '0.625rem',
      siteMax: '90rem',
    }),
  ])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Test shorthand property replacements
 */
describe('Test `tidy-var` function replacement', () => {
  test(
    'Single `gap` value',
    () => run(
      'div { margin-left: tidy-var("gap"); }',
      'div { margin-left: 1.25rem; }',
    ),
  );

  test(
    'Single `edge` value',
    () => run(
      'div { padding-left: tidy-var("edge"); }',
      'div { padding-left: 0.625rem; }',
    ),
  );

  test(
    'Single `siteMax` value',
    () => run(
      'div { max-width: tidy-var("siteMax"); }',
      'div { max-width: 90rem; }',
    ),
  );

  test(
    'Multiple `gap` values',
    () => run(
      'div { margin: 0 tidy-var("gap") 0 tidy-var("gap"); }',
      'div { margin: 0 1.25rem 0 1.25rem; }',
    ),
  );

  test(
    'Multiple `edge` values',
    () => run(
      'div { padding: 0 tidy-var("edge") 0 tidy-var("gap"); }',
      'div { padding: 0 0.625rem 0 1.25rem; }',
    ),
  );

  test(
    'Multiple mixed values',
    () => run(
      'div { max-width: calc(tidy-var("siteMax") + tidy-var(edge) * 2); }',
      'div { max-width: calc(90rem + 0.625rem * 2); }',
    ),
  );

  test(
    'Single-quoted value',
    () => run(
      "div { margin-left: tidy-var('gap'); }",
      'div { margin-left: 1.25rem; }',
    ),
  );

  test(
    'Douple-quoted value',
    () => run(
      'div { margin-left: tidy-var("gap"); }',
      'div { margin-left: 1.25rem; }',
    ),
  );

  test(
    'Unquoted value',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { margin-left: 1.25rem; }',
    ),
  );

  test(
    'No option value',
    () => run(
      'div { margin-left: tidy-var(flurm); }',
      'div { margin-left: tidy-var(flurm); }',
    ),
  );
});
