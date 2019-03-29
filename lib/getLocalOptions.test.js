const postcss = require('postcss');
const getLocalOptions = require('./getLocalOptions');
const { typical, typicalWithBreakpoints, columnsOnly } = require('../test/sharedConfigs');

/**
 * Create a test plugin to collect local options. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const localOptionsPlugin = postcss.plugin(
  'local-options-test',
  opts => function process(root, result) {
    root.walkRules((rule) => {
      result.localOptions = getLocalOptions(rule, opts); // eslint-disable-line no-param-reassign
    });
  },
);

/**
 * Basic plugin test.
 * Run the plugin and return the output.
 */
const runLocalOptionsPlugin = (input, output, opts) => (
  postcss([localOptionsPlugin(opts)])
    .process(input, { from: undefined })
    .then((result) => {
      expect(result.localOptions).toEqual(output);
      expect(result.warnings().length).toBe(0);
    })
);

/**
 * Run the test plugin and return the output.
 */
describe('Walk any `tidy` at-rules and collect locally-scoped options.', () => {
  test(
    '@tidy value overrides global option',
    () => runLocalOptionsPlugin(
      'div { @tidy columns 8; }',
      {
        columns: 8,
        edge: '0.625rem',
        gap: '1.25rem',
        siteMax: '90rem',
      },
      typical,
    ),
  );

  test(
    '@tidy value adds a global option',
    () => runLocalOptionsPlugin(
      'div { @tidy site-max 90rem; }',
      {
        columns: 12,
        siteMax: '90rem',
      },
      columnsOnly,
    ),
  );
});

describe('Declarations use the correct option values', () => {
  test(
    'The corrrect options are used when a matching breakpoint is found',
    () => runLocalOptionsPlugin(
      '@media (min-width: 768px) { div { } }',
      {
        columns: 12,
        edge: '0.625rem',
        gap: '0.625rem',
        breakpoints: [
          {
            breakpoint: '768px',
            gap: '0.625rem',
          },
          {
            breakpoint: '1024px',
            siteMax: '90rem',
          },
        ],
        breakpoint: '768px',
        collectedBreakpointValues: [
          '768px',
          '1024px',
        ],
      },
      Object.assign(typicalWithBreakpoints, {
        collectedBreakpointValues: [
          '768px',
          '1024px',
        ],
      }),
    ),
  );

  test(
    'Global options are used when there is no matching breakpoint',
    () => runLocalOptionsPlugin(
      '@media (min-width: 600px) { div { } }',
      {
        columns: 12,
        edge: '0.625rem',
        gap: '1.25rem',
        breakpoints: [
          {
            breakpoint: '768px',
            gap: '0.625rem',
          },
          {
            breakpoint: '1024px',
            siteMax: '90rem',
          },
        ],
        collectedBreakpointValues: [
          '768px',
          '1024px',
        ],
      },
      typicalWithBreakpoints,
    ),
  );
});
