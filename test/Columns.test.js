/* eslint-disable max-len */
const {
  allValues,
  edgeGap,
  edgeMax,
  gapMax,
  edgeOnly,
  gapOnly,
  maxOnly,
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
      if (true === test.skip) {
        return acc;
      }

      return [...acc, Object.values(test)];
    }, []);

    test.each(reducedTests)(
      '%s',
      (theTest, actual, expected) => {
        expect(actual).toEqual(expected);
      },
    );
  });
};

describe('Checking values passed to Columns.buildCalcFunction()', () => {
  describe('All options', () => {
    const instance = new Columns(allValues);
    jest.spyOn(instance, 'buildCalcFunction');

    test('Single column', () => {
      instance.spanCalc(1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 0);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 0);
    });

    test('Fractional columns (greater than 2)', () => {
      instance.spanCalc(2.5);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
    });
  });

  test('Omits a `full` value with no `max` option', () => {
    const instance = new Columns(edgeGap);
    jest.spyOn(instance, 'buildCalcFunction');

    instance.spanCalc(2.5);
    expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
  });
});

describe('Get calc functions from buildCalcFunction()', () => {
  describe('All options', () => {
    const instance = new Columns(allValues); // eslint-disable-line

    test('Single column', () => {
      const expected = 'calc((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem)';

      expect(instance.buildCalcFunction(1, 0)).toEqual(expected);
    });

    test('Fractional columns (greater than 2)', () => {
      const expected = 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)';

      expect(instance.buildCalcFunction(2.5, 2)).toEqual(expected);
    });
  });

  test('Omits a `full` value with no `max` option', () => {
    const instance = new Columns(edgeGap);

    const expected = 'calc((100vw - 1rem * 2) / 12 - 9.1667px)';

    expect(instance.buildCalcFunction(1, 0)).toEqual(expected);
  });
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
      actual: new Columns(edgeMax).getSharedGap(),
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
 * Create the column `calc()` function declaration for each base value.
 */
testColumnsMethod({
  description: 'Create the column `calc()` function declaration for each base value',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Columns(allValues).spanCalc(1),
      expected: 'calc((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem)',
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).spanCalc(2),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)',
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).spanCalc(4),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).spanCalc(-4),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -3)',
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).spanCalc(0.5),
      expected: 'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.5)',
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).spanCalc(1.75),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).spanCalc(2.5),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
    },
    // ---------- No max
    {
      description: 'Omits a `full` value with no `max` option',
      actual: new Columns(edgeGap).spanCalc(1),
      expected: 'calc((100vw - 1rem * 2) / 12 - 9.1667px)',
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeMax).spanCalc(1),
      expected: 'calc((min(100vw, 1024px) - 1.25rem * 2) / 16)',
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeMax).spanCalc(2),
      expected: 'calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)',
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapMax).spanCalc(1),
      expected: 'calc(min(100vw, 60rem) / 16 - 14.0625px)',
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).spanCalc(1),
      expected: 'calc((100vw - 20px * 2) / 12)',
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).spanCalc(1),
      expected: 'calc(100vw / 12 - 0.8594rem)',
    },
    // ---------- max only
    {
      description: 'Omits undeclared values from span ouput: `max` only',
      actual: new Columns(maxOnly).spanCalc(1),
      expected: 'calc(min(100vw, 1200px) / 16)',
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(maxOnly).spanCalc(5),
      expected: 'calc((min(100vw, 1200px) / 16) * 5)',
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).spanCalc(1),
      expected: 'calc(100vw / 12)',
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).spanCalc(3),
      expected: 'calc((100vw / 12) * 3)',
    },
    // ---------- Custom Properties
    {
      description: 'Custom properties used in option values',
      actual: new Columns(customProperties).spanCalc(3),
      expected: 'calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
    },
  ],
});

/**
 * Create the offset `calc()` function declaration for each base value.
 */
testColumnsMethod({
  description: 'Create the offset `calc()` function declaration for each base value',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Columns(allValues).offsetCalc(1),
      expected: 'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
    },
    {
      description: 'All options: two columns',
      actual: new Columns(allValues).offsetCalc(2),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem * 2)',
    },
    {
      description: 'All options: three columns',
      actual: new Columns(allValues).offsetCalc(3),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 3) + 0.625rem * 3)',
    },
    {
      description: 'All options: negative columns',
      actual: new Columns(allValues).offsetCalc(-4),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -4)',
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Columns(allValues).offsetCalc(0.75),
      expected: 'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.75)',
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Columns(allValues).offsetCalc(1.5),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Columns(allValues).offsetCalc(2.075),
      expected: 'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
    },
    // ---------- No max
    {
      description: 'Omits a `full` value with no `max` option',
      actual: new Columns(edgeGap).offsetCalc(1),
      expected: 'calc(((100vw - 1rem * 2) / 12 - 9.1667px) + 10px)',
    },
    // ---------- No gap
    {
      description: 'Omits shared gap for single column with no `gap` option',
      actual: new Columns(edgeMax).offsetCalc(1),
      expected: 'calc((min(100vw, 1024px) - 1.25rem * 2) / 16)',
    },
    {
      description: 'Omits the gap addition wtih no `gap` option',
      actual: new Columns(edgeMax).offsetCalc(2),
      expected: 'calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)',
    },
    // ---------- No edge
    {
      description: 'Omits the edge subtraction with no `edge` option',
      actual: new Columns(gapMax).offsetCalc(1),
      expected: 'calc((min(100vw, 60rem) / 16 - 14.0625px) + 15px)',
    },
    // ---------- Edges only
    {
      description: 'Omits undeclared values from span ouput: `edge` only',
      actual: new Columns(edgeOnly).offsetCalc(1),
      expected: 'calc((100vw - 20px * 2) / 12)',
    },
    {
      description: 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      actual: new Columns(edgeOnly).offsetCalc(2),
      expected: 'calc(((100vw - 20px * 2) / 12) * 2)',
    },
    // ---------- Gap only
    {
      description: 'Omits undeclared values from span ouput: `gap` only',
      actual: new Columns(gapOnly).offsetCalc(1),
      expected: 'calc((100vw / 12 - 0.8594rem) + 0.9375rem)',
    },
    // ---------- max only
    {
      description: 'Omits undeclared values from span ouput: `max` only',
      actual: new Columns(maxOnly).offsetCalc(1),
      expected: 'calc(min(100vw, 1200px) / 16)',
    },
    // ---------- Columns only
    {
      description: 'Omits undeclared values from span ouput: `columns` only',
      actual: new Columns(columnsOnly).offsetCalc(1),
      expected: 'calc(100vw / 12)',
    },
    {
      description: 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      actual: new Columns(columnsOnly).offsetCalc(4),
      expected: 'calc((100vw / 12) * 4)',
    },
    // ---------- Custom Properties
    {
      description: 'Custom properties used in option values',
      actual: new Columns(customProperties).offsetCalc(3),
      expected: 'calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 3)',
    },
  ],
});
