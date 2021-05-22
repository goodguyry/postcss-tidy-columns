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
      (theTest, actual, expected) => {
        expect(actual).toEqual(expected);
      },
    );
  });
};

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
 * Test parsing option values.
 */
testColumnsMethod({
  description: 'Parse options for expressions',
  tests: [
    {
      description: 'Parse options: allValues',
      actual: new Columns(allValues).parseDeclarationOptions('75rem'),
      expected: {
        hasCustomProperty: false,
        canReduce: ['rem'],
        siteMax: [
          {
            raw: '100vw',
            value: 100,
            units: 'vw',
            each: '6.25', // (value / columns)
          },
          {
            raw: '75rem',
            value: 75,
            units: 'rem',
            each: '4.6875', // (value / columns)
          },
        ],
        gap: {
          raw: '0.625rem',
          value: 0.625,
          units: 'rem',
          each: '0.5859', // (value / columns) * (columns - 1),
        },
        edge: {
          raw: '32px',
          value: 32,
          units: 'px',
          each: '4', // ((value * 2) / columns)
        },
        columns: {
          raw: 16,
          value: 16,
          units: undefined,
          each: undefined,
        },
      },
    },
    {
      description: 'Parse options: Custom properties',
      actual: new Columns(customProperties).parseDeclarationOptions('90rem'),
      expected: {
        hasCustomProperty: true,
        canReduce: false,
        siteMax: [
          {
            raw: '100vw',
            value: 100,
            units: 'vw',
            each: undefined,
          },
          {
            raw: '90rem',
            value: 90,
            units: 'rem',
            each: undefined,
          },
        ],
        gap: {
          raw: 'var(--gap)',
          value: undefined,
          units: undefined,
          each: undefined,
        },
        edge: {
          raw: 'var(--edge)',
          value: undefined,
          units: undefined,
          each: undefined,
        },
        columns: {
          raw: 'var(--columns)',
          value: undefined,
          units: undefined,
          each: undefined,
        },
      },
    },
  ],
});

/**
 * Test reducing calc functions.
 */
testColumnsMethod({
  description: 'Reduce calculations',
  tests: [
    {
      description: 'All options: Span six columns',
      actual: new Columns(allValues).spanCalc(6),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 6) + 3.125rem)
        fluid: 'calc(37.5vw - 24px - 0.3904rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 6) + 3.125rem)
        full: 'calc(27.7346rem - 24px)',
      },
    },
    {
      description: 'All options: Offset two columns',
      actual: new Columns(allValues).offsetCalc(2),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 2) + 1.25rem)
        fluid: 'calc(12.5vw - 8px + 0.0782rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 2) + 1.25rem)
        full: 'calc(9.4532rem - 8px)',
      },
    },
    {
      description: 'Custom properties used in option values',
      actual: new Columns(customProperties).spanCalc(3),
      expected: {
        fluid: 'calc((((100vw - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
        full: 'calc((((90rem - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
      },
    },
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
        fluid: 'calc(6.25vw - 4px - 0.5859rem)',
        full: 'calc(4.1016rem - 4px)',
      },
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).spanCalc(2),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 2) + 0.625rem)
        fluid: 'calc(12.5vw - 8px - 0.5468rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 2) + 0.625rem)
        full: 'calc(8.8282rem - 8px)',
      },
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).spanCalc(4),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 4) + 1.875rem)
        fluid: 'calc(25vw - 16px - 0.4686rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 4) + 1.875rem)
        full: 'calc(18.2814rem - 16px)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).spanCalc(-4),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * -4) + -1.875rem)
        fluid: 'calc(-25vw + 16px + 0.4686rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * -4) + -1.875rem)
        full: 'calc(-18.2814rem + 16px)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).spanCalc(0.5),
      expected: {
        // calc(((100vw - 64px) / 16 - 0.5859rem) * 0.5)
        fluid: 'calc(3.125vw - 2px - 0.293rem)',
        // calc(((75rem - 64px) / 16 - 0.5859rem) * 0.5)
        full: 'calc(2.0508rem - 2px)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).spanCalc(1.75),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 1.75) + 0.625rem)
        fluid: 'calc(10.9375vw - 7px - 0.4003rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 1.75) + 0.625rem)
        full: 'calc(7.8028rem - 7px)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).spanCalc(2.5),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 2.5) + 1.25rem)
        fluid: 'calc(15.625vw - 10px - 0.2148rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 2.5.5) + 1.25rem)
        full: 'calc(11.504rem - 10px)',
      },
    },
    // ---------- No siteMax
    {
      description: 'Omits a `full` value with no `siteMax` option',
      actual: new Columns(edgeGap).spanCalc(1),
      expected: {
        // fluid: 'calc((100vw - 2rem) / 12 - 9.1667px)
        fluid: 'calc(8.3333vw - 0.1667rem - 9.1667px)',
      },
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeSiteMax).spanCalc(1),
      expected: {
        // calc((100vw - 2.5rem) / 16)
        fluid: 'calc(6.25vw - 0.1563rem)',
        full: 'calc(64px - 0.1563rem)',
      },
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeSiteMax).spanCalc(2),
      expected: {
        fluid: 'calc(12.5vw - 0.3126rem)',
        full: 'calc(128px - 0.3126rem)',
      },
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapSiteMax).spanCalc(1),
      expected: {
        fluid: 'calc(6.25vw - 14.0625px)',
        full: 'calc(3.75rem - 14.0625px)',
      },
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).spanCalc(1),
      expected: {
        fluid: 'calc(8.3333vw - 3.3333px)',
      },
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).spanCalc(1),
      expected: {
        fluid: 'calc(8.3333vw - 0.8594rem)',
      },
    },
    // ---------- siteMax only
    {
      description: 'Omits undeclared values from span ouput: `siteMax` only',
      actual: new Columns(siteMaxOnly).spanCalc(1),
      expected: {
        fluid: 'calc(6.25vw)',
        full: 'calc(75px)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(siteMaxOnly).spanCalc(5),
      expected: {
        fluid: 'calc(31.25vw)',
        full: 'calc(375px)',
      },
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).spanCalc(1),
      expected: {
        fluid: 'calc(8.3333vw)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).spanCalc(3),
      expected: {
        fluid: 'calc(24.9999vw)', // 'calc(25vw)'
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
        // calc(((100vw - 64px) / 16 - 0.5859rem) + 0.625rem)
        fluid: 'calc(6.25vw - 4px + 0.0391rem)',
        // calc(((75rem - 64px) / 16 - 0.5859rem) + 0.625rem)
        full: 'calc(4.7266rem - 4px)',
      },
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).offsetCalc(2),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 2) + 1.25rem)
        fluid: 'calc(12.5vw - 8px + 0.0782rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 2) + 1.25rem)
        full: 'calc(9.4532rem - 8px)',
      },
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).offsetCalc(3),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 3) + 1.875rem)
        fluid: 'calc(18.75vw - 12px + 0.1173rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 3) + 1.875rem)
        full: 'calc(14.1798rem - 12px)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).offsetCalc(-4),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * -4) + -2.5rem)
        fluid: 'calc(-25vw + 16px - 0.1564rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * -4) + -2.5rem)
        full: 'calc(-18.9064rem + 16px)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).offsetCalc(0.75),
      expected: {
        // calc(((100vw - 64px) / 16 - 0.5859rem) * 0.75)
        fluid: 'calc(4.6875vw - 3px - 0.4394rem)',
        // calc(((75rem - 64px) / 16 - 0.5859rem) * 0.75)
        full: 'calc(3.0762rem - 3px)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).offsetCalc(1.5),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 1.5) + 0.625rem)
        fluid: 'calc(9.375vw - 6px - 0.2539rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 1.5) + 0.625rem)
        full: 'calc(6.7774rem - 6px)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).offsetCalc(2.075),
      expected: {
        // calc((((100vw - 64px) / 16 - 0.5859rem) * 2.075) + 1.25rem)
        fluid: 'calc(12.9688vw - 8.3px + 0.0343rem)',
        // calc((((75rem - 64px) / 16 - 0.5859rem) * 2.075) + 1.25rem)
        full: 'calc(9.7609rem - 8.3px)',
      },
    },
    // ---------- No siteMax
    {
      description: 'Omits a `full` value with no `siteMax` option',
      actual: new Columns(edgeGap).offsetCalc(1),
      expected: {
        // calc(((100vw - 2rem) / 12 - 9.1667px) + 10px)
        fluid: 'calc(8.3333vw - 0.1667rem + 0.8333px)',
      },
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeSiteMax).offsetCalc(1),
      expected: {
        // calc((100vw - 2.5rem) / 16)
        fluid: 'calc(6.25vw - 0.1563rem)',
        // calc((1024px - 2.5rem) / 16)
        full: 'calc(64px - 0.1563rem)',
      },
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeSiteMax).offsetCalc(2),
      expected: {
        // calc(((100vw - 2.5rem) / 16) * 2)
        fluid: 'calc(12.5vw - 0.3126rem)',
        // calc(((1024px - 2.5rem) / 16) * 2)
        full: 'calc(128px - 0.3126rem)',
      },
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapSiteMax).offsetCalc(1),
      expected: {
        // calc((100vw / 16 - 14.0625px) + 15px)
        fluid: 'calc(6.25vw + 0.9375px)',
        // calc((60rem / 16 - 14.0625px) + 15px)
        full: 'calc(3.75rem + 0.9375px)',
      },
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).offsetCalc(1),
      expected: {
        // calc((100vw - 40px) / 12)
        fluid: 'calc(8.3333vw - 3.3333px)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(edgeOnly).offsetCalc(2),
      expected: {
        // calc(((100vw - 40px) / 12) * 2)
        fluid: 'calc(16.6666vw - 6.6666px)',
      },
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).offsetCalc(1),
      expected: {
        // calc((100vw / 12 - 0.8594rem) + 0.9375rem)
        fluid: 'calc(8.3333vw + 0.0781rem)',
      },
    },
    // ---------- siteMax only
    {
      description: 'Omits undeclared values from span ouput: `siteMax` only',
      actual: new Columns(siteMaxOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(6.25vw)',
        full: 'calc(75px)',
      },
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(8.3333vw)',
      },
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).offsetCalc(4),
      expected: {
        fluid: 'calc(33.3332vw)',
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
