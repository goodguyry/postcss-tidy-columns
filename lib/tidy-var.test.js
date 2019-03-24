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
      breakpoints: [
        {
          breakpoint: '768px',
          gap: '0.625rem',
        },
      ],
    }),
  ])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Test property replacements
 */
describe('Test `tidy-var` function replacement', () => {
  test(
    'Single `gap` value',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { margin-left: 1.25rem; }',
    ),
  );

  test(
    'Single `edge` value',
    () => run(
      'div { padding-left: tidy-var(edge); }',
      'div { padding-left: 0.625rem; }',
    ),
  );

  test(
    'Single `siteMax` value',
    () => run(
      'div { max-width: tidy-var(siteMax); }',
      'div { max-width: 90rem; }',
    ),
  );

  test(
    'Multiple `gap` values',
    () => run(
      'div { margin: 0 tidy-var(gap) 0 tidy-var(gap); }',
      'div { margin: 0 1.25rem 0 1.25rem; }',
    ),
  );

  test(
    'Mixed values',
    () => run(
      'div { padding: 0 tidy-var(edge) 0 tidy-var(gap); }',
      'div { padding: 0 0.625rem 0 1.25rem; }',
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
    'No option value',
    () => run(
      'div { margin-left: tidy-var(flurm); }',
      'div { margin-left: tidy-var(flurm); }',
    ),
  );

  test(
    'Breakpoint matching',
    () => run(
      // eslint-disable-next-line max-len
      'div { margin-left: tidy-var(gap); } @media (min-width: 900px) { div { margin-left: tidy-var(gap); } }',
      'div { margin-left: 1.25rem; } @media (min-width: 900px) { div { margin-left: 0.625rem; } }',
    ),
  );
});
