/* eslint-disable max-len */
const {
  allValues,
  edgeGap,
  edgeSiteMax,
  gapSiteMax,
  edgeOnly,
  gapOnly,
  siteMaxOnly,
  columnsOnly,
  customProperties,
} = require('./sharedConfigs');
const Columns = require('../Columns');

/**
 * Test a method of the Columns class.
 *
 * @param {Object} testConfig {
 *   @param {String} testConfig.description The test suite description.
 *   @param {Array}  testConfig.tests       An array of Test Objects
 * }
 */
const testColumnsMethod = (testConfig) => {
  describe(testConfig.description, () => {
    /**
     * Run each test.
     *
     * @param {Object} unitTest {
     *   @param {String} unitTest.description The test description.
     *   @param {String} unitTest.actual      The test's plugin output.
     *   @param {String} unitTest.expected    The expected plugin output.
     * }
     */
    const reducedTests = testConfig.tests.reduce((acc, test) => {
      // TODO: Use Object.values(test) once Node v6 support is dropped.
      const testValues = Object.keys(test).map(key => test[key]);
      return [...acc, testValues];
    }, []);

    test.each(reducedTests)(
      '%s',
      (theTest) => {
        expect(theTest.actual).toEqual(theTest.expected);
      },
    );
  });
};

/**
 * Separate a CSS length value's number from its units.
 */
testColumnsMethod({
  description: "Separate a CSS length value's number from its units",
  tests: [
    {
      description: 'Separates a `px` value from its units',
      actual: Columns.splitCssUnit('10px'),
      expected: [10, 'px'],
    },
    {
      description: 'Separates a `rem` value from its units',
      actual: Columns.splitCssUnit('0.625rem'),
      expected: [0.625, 'rem'],
    },
    {
      description: 'Separates a `em` value from its units',
      actual: Columns.splitCssUnit('2em'),
      expected: [2, 'em'],
    },
    {
      description: 'Ignores a unitless value',
      actual: Columns.splitCssUnit(12),
      expected: 12,
    },
  ],
});

/**
 * Calculate the shared gap amount to be removed from each column.
 */
testColumnsMethod({
  description: 'Calculate the shared gap amount to be removed from each column',
  tests: [
    {
      description: 'Calculates a shared gap with `rem` value',
      actual: new Columns(allValues).getSharedGap(),
      expected: '0.5859rem',
    },
    {
      description: 'Calculates a shared gap with `px` value',
      actual: new Columns(edgeGap).getSharedGap(),
      expected: '9.1667px',
    },
    {
      description: 'Calculates a `0` shared gap if a gap option is not declared',
      actual: new Columns(edgeSiteMax).getSharedGap(),
      expected: 0,
    },
    {
      description: 'Builds the shared gap calculation when `gap` is a CSS Custom Property',
      actual: new Columns(customProperties).getSharedGap(),
      expected: `(${customProperties.gap} / ${customProperties.columns} * (${customProperties.columns} - 1))`,
    },
  ],
});

/**
 * Round the given number to the specified number of decimal places.
 */
testColumnsMethod({
  description: 'Round the given number to the specified number of decimal places',
  tests: [
    {
      description: 'Rounds to a single decimal place',
      actual: Columns.roundToPrecision(1.2345, 1),
      expected: 1.2,
    },
    {
      description: 'Rounds to two decimal places',
      actual: Columns.roundToPrecision(1.2345, 2),
      expected: 1.23,
    },
    {
      description: 'Rounds to three decimal places',
      actual: Columns.roundToPrecision(1.2345, 3),
      expected: 1.235,
    },
    {
      description: 'Rounds to four decimal places',
      actual: Columns.roundToPrecision(1.2345, 4),
      expected: 1.2345,
    },
    {
      description: 'Ignores rounding a number shorter than the precision',
      actual: Columns.roundToPrecision(1.2, 4),
      expected: 1.2,
    },
    {
      description: 'Ignores a whole number',
      actual: Columns.roundToPrecision(1, 3),
      expected: 1,
    },
    {
      description: 'Rounds to zero decimal places',
      actual: Columns.roundToPrecision(1.234, 0),
      expected: 1,
    },
    {
      description: 'Ignores rounding a `0`',
      actual: Columns.roundToPrecision(0, 4),
      expected: 0,
    },
    {
      description: 'Rounds a negative number as expected',
      actual: Columns.roundToPrecision(-1.2345, 2),
      expected: -1.23,
    },
  ],
});

/**
 * Create the column `calc()` function declaration for each siteMax.
 */
testColumnsMethod({
  description: 'Create the column `calc()` function declaration for each siteMax',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Columns(allValues).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 32px * 2) / 16 - 0.5859rem)',
        full: 'calc((75rem - 32px * 2) / 16 - 0.5859rem)',
      },
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).spanCalc(2),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)',
      },
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).spanCalc(4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).spanCalc(-4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -3)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -3)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).spanCalc(0.5),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) * 0.5)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) * 0.5)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).spanCalc(1.75),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).spanCalc(2.5),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
      },
    },
    // ---------- No siteMax
    {
      description: 'Omits a `full` value with no `siteMax` option',
      actual: new Columns(edgeGap).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 1rem * 2) / 12 - 9.1667px)',
      },
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeSiteMax).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 1.25rem * 2) / 16)',
        full: 'calc((1024px - 1.25rem * 2) / 16)',
      },
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeSiteMax).spanCalc(2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * 2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * 2)',
      },
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapSiteMax).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 16 - 14.0625px)',
        full: 'calc(60rem / 16 - 14.0625px)',
      },
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 20px * 2) / 12)',
      },
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 12 - 0.8594rem)',
      },
    },
    // ---------- siteMax only
    {
      description: 'Omits undeclared values from span ouput: `siteMax` only',
      actual: new Columns(siteMaxOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 16)',
        full: 'calc(1200px / 16)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(siteMaxOnly).spanCalc(5),
      expected: {
        fluid: 'calc((100vw / 16) * 5)',
        full: 'calc((1200px / 16) * 5)',
      },
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 12)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).spanCalc(3),
      expected: {
        fluid: 'calc((100vw / 12) * 3)',
      },
    },
    // ---------- Custom Properties
    {
      description: 'Custom properties used in option values',
      actual: new Columns(customProperties).spanCalc(3),
      expected: {
        fluid: 'calc((((100vw - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
        full: 'calc((((90rem - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
      },
    },
  ],
});

/**
 * Create the offset `calc()` function declaration for each siteMax.
 */
testColumnsMethod({
  description: 'Create the offset `calc()` function declaration for each siteMax',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Columns(allValues).offsetCalc(1),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
      },
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).offsetCalc(2),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem * 2)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem * 2)',
      },
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).offsetCalc(3),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 3) + 0.625rem * 3)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 3) + 0.625rem * 3)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).offsetCalc(-4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -4)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -4)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).offsetCalc(0.75),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) * 0.75)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) * 0.75)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).offsetCalc(1.5),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).offsetCalc(2.075),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
      },
    },
    // ---------- No siteMax
    {
      description: 'Omits a `full` value with no `siteMax` option',
      actual: new Columns(edgeGap).offsetCalc(1),
      expected: {
        fluid: 'calc(((100vw - 1rem * 2) / 12 - 9.1667px) + 10px)',
      },
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeSiteMax).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw - 1.25rem * 2) / 16)',
        full: 'calc((1024px - 1.25rem * 2) / 16)',
      },
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeSiteMax).offsetCalc(2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * 2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * 2)',
      },
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapSiteMax).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw / 16 - 14.0625px) + 15px)',
        full: 'calc((60rem / 16 - 14.0625px) + 15px)',
      },
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw - 20px * 2) / 12)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(edgeOnly).offsetCalc(2),
      expected: {
        fluid: 'calc(((100vw - 20px * 2) / 12) * 2)',
      },
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw / 12 - 0.8594rem) + 0.9375rem)',
      },
    },
    // ---------- siteMax only
    {
      description: 'Omits undeclared values from span ouput: `siteMax` only',
      actual: new Columns(siteMaxOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(100vw / 16)',
        full: 'calc(1200px / 16)',
      },
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(100vw / 12)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).offsetCalc(4),
      expected: {
        fluid: 'calc((100vw / 12) * 4)',
      },
    },
    // ---------- Custom Properties
    {
      description: 'Custom properties used in option values',
      actual: new Columns(customProperties).offsetCalc(3),
      expected: {
        fluid: 'calc((((100vw - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 3)',
        full: 'calc((((90rem - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 3)',
      },
    },
  ],
});
