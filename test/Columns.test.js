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
 * Calculate the shared gap amount to be removed from each column.
 */
test('Calculate the shared gap amount to be removed from each column', () => {
  // Calculates a shared gap with `rem` value.
  expect(new Columns(allValues).getSharedGap())
    .toBe('0.5859rem');
  // Calculates a shared gap with `px` value.
  expect(new Columns(edgeGap).getSharedGap())
    .toBe('9.1667px');
  // Calculates a `0` shared gap if a gap option is not declared.
  expect(new Columns(edgeMax).getSharedGap())
    .toBe(0);
  // Builds the shared gap calculation when `gap` is a CSS Custom Property.
  expect(new Columns(customProperties).getSharedGap())
    .toBe(`(${customProperties.gap} / ${customProperties.columns} * (${customProperties.columns} - 1))`);
});

describe('Checking values passed to Columns.buildCalcFunction()', () => {
  const instance = new Columns(allValues);
  jest.spyOn(instance, 'buildCalcFunction');

  describe('From spanCalc', () => {
    test('Fractional columns (lower than 1)', () => {
      instance.spanCalc(0.5);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(0.5, -0); // @todo These should be 0.
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(0.5, -0); // @todo These should be 0.
    });

    test('Single column', () => {
      instance.spanCalc(1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 0);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 0);
    });

    test('Fractional columns (greater than 1)', () => {
      instance.spanCalc(1.75);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
    });

    test('Fractional columns (greater than 2)', () => {
      instance.spanCalc(2.5);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
    });
  });

  describe('From offsetCalc', () => {
    test('Fractional columns (lower than 1)', () => {
      instance.offsetCalc(0.5);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(0.5, 0);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(0.5, 0);
    });

    test('Single column', () => {
      instance.offsetCalc(1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1, 1);
    });

    test('Fractional columns (greater than 1)', () => {
      instance.offsetCalc(1.75);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
    });

    test('Fractional columns (greater than 2)', () => {
      instance.offsetCalc(2.5);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
      expect(instance.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
    });
  });
});

describe('Get calc functions from spanCalc()', () => {
  test('All options', () => {
    const instance = new Columns(allValues);

    // Single column.
    expect(instance.spanCalc(1))
      .toBe('calc((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem)');

    // Two columns (one gap).
    expect(instance.spanCalc(2))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)');

    // Multiple columns.
    expect(instance.spanCalc(4))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)');

    // Fractional columns (less than 1)
    expect(instance.spanCalc(0.5))
      .toBe('calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.5)');

    // Fractional columns (greater than 1)
    expect(instance.spanCalc(1.75))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)');

    // Fractional columns (greater than 2)
    expect(instance.spanCalc(2.5))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)');
  });

  test('Various missing option values', () => {
    // 'Omits a `full` value with no `max` option',
    expect(new Columns(edgeGap).spanCalc(1))
      .toBe('calc((100vw - 1rem * 2) / 12 - 9.1667px)');

    // 'Omits shared gap for single column with no `gap` option',
    expect(new Columns(edgeMax).spanCalc(1))
      .toBe('calc((min(100vw, 1024px) - 1.25rem * 2) / 16)');

    // 'Omits the gap addition wtih no `gap` option',
    expect(new Columns(edgeMax).spanCalc(2))
      .toBe('calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)');

    // 'Omits the edge subtraction with no `edge` option',
    expect(new Columns(gapMax).spanCalc(1))
      .toBe('calc(min(100vw, 60rem) / 16 - 14.0625px)');

    // 'Omits undeclared values from span ouput: `edge` only',
    expect(new Columns(edgeOnly).spanCalc(1))
      .toBe('calc((100vw - 20px * 2) / 12)');

    // 'Omits undeclared values from span ouput: `gap` only',
    expect(new Columns(gapOnly).spanCalc(1))
      .toBe('calc(100vw / 12 - 0.8594rem)');

    // 'Omits undeclared values from span ouput: `max` only',
    expect(new Columns(maxOnly).spanCalc(1))
      .toBe('calc(min(100vw, var(--tmax)) / 16)');

    // 'Omits undeclared values from span ouput: `edge` only (multiple columns)',
    expect(new Columns(maxOnly).spanCalc(5))
      .toBe('calc((min(100vw, var(--tmax)) / 16) * 5)');

    // 'Omits undeclared values from span ouput: `columns` only',
    expect(new Columns(columnsOnly).spanCalc(1))
      .toBe('calc(100vw / 12)');

    // 'Omits undeclared values from span ouput: `columns` only (multiple columns)',
    expect(new Columns(columnsOnly).spanCalc(3))
      .toBe('calc((100vw / 12) * 3)');

    // Custom properties used in option values.
    expect(new Columns(customProperties).spanCalc(3))
      .toBe('calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)');
  });

  test('`base` option applied as expected', () => {
    const percent = new Columns({ ...columnsOnly, base: '%' });
    expect(percent.spanCalc(1)).toBe('calc(100% / 12)');

    const pixel = new Columns({ ...columnsOnly, base: 'px' });
    expect(pixel.spanCalc(1)).toBe('calc(100vw / 12)');
  });
});

describe('Get calc functions from offsetCalc()', () => {
  test('All options', () => {
    const instance = new Columns(allValues);

    // Single column.
    expect(instance.offsetCalc(1))
      .toBe('calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) + 0.625rem)');

    // Two columns (two gaps).
    expect(instance.offsetCalc(2))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem * 2)');

    // Multiple columns.
    expect(instance.offsetCalc(4))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 4)');

    // Fractional columns (less than 1).
    expect(instance.offsetCalc(0.75))
      .toBe('calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.75)');

    // Fractional columns (greater than 1).
    expect(instance.offsetCalc(1.5))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)');

    // Fractional columns (greater than 2).
    expect(instance.offsetCalc(2.075))
      .toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)');
  });

  test('Various missing option values', () => {
    // Omits a `full` value with no `max` option
    expect(new Columns(edgeGap).offsetCalc(1))
      .toBe('calc(((100vw - 1rem * 2) / 12 - 9.1667px) + 10px)');
    // Omits shared gap for single column with no `gap` option
    expect(new Columns(edgeMax).offsetCalc(1))
      .toBe('calc((min(100vw, 1024px) - 1.25rem * 2) / 16)');
    // Omits the gap addition wtih no `gap` option
    expect(new Columns(edgeMax).offsetCalc(2))
      .toBe('calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)');
    // Omits the edge subtraction with no `edge` option
    expect(new Columns(gapMax).offsetCalc(1))
      .toBe('calc((min(100vw, 60rem) / 16 - 14.0625px) + 15px)');
    // Omits undeclared values from span ouput: `edge` only
    expect(new Columns(edgeOnly).offsetCalc(1))
      .toBe('calc((100vw - 20px * 2) / 12)');
    // Omits undeclared values from span ouput: `edge` only (multiple columns)
    expect(new Columns(edgeOnly).offsetCalc(2))
      .toBe('calc(((100vw - 20px * 2) / 12) * 2)');
    // Omits undeclared values from span ouput: `gap` only
    expect(new Columns(gapOnly).offsetCalc(1))
      .toBe('calc((100vw / 12 - 0.8594rem) + 0.9375rem)');
    // Omits undeclared values from span ouput: `max` only
    expect(new Columns(maxOnly).offsetCalc(1))
      .toBe('calc(min(100vw, var(--tmax)) / 16)');
    // Omits undeclared values from span ouput: `columns` only
    expect(new Columns(columnsOnly).offsetCalc(1))
      .toBe('calc(100vw / 12)');
    // Omits undeclared values from span ouput: `columns` only (multiple columns)
    expect(new Columns(columnsOnly).offsetCalc(4))
      .toBe('calc((100vw / 12) * 4)');

    // Custom properties used in option values.
    expect(new Columns(customProperties).offsetCalc(3))
      .toBe('calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 3)');
  });
});
