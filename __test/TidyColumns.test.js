/* eslint-disable max-len */
const postcss = require('postcss');
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
const TidyColumns = require('../TidyColumns');

/**
 * Compare numerical strings.
 */
describe('Calculate the shared gap amount to be removed from each column', () => {
  test.each([
    [
      'Calculates a shared gap with `rem` value',
      allValues,
      '0.5859rem',
    ],
    [
      'Calculates a shared gap with `px` value',
      edgeGap,
      '9.1667px',
    ],
    [
      'Calculates a `0` shared gap if a gap option is not declared',
      edgeMax,
      0,
    ],
    ['Builds the shared gap calculation when `gap` is a CSS Custom Property',
      customProperties,
      `(${customProperties.gap} / ${customProperties.columns} * (${customProperties.columns} - 1))`,
    ],
  ])(
    '%O',
    (desc, opts, output) => {
      const tidy = new TidyColumns();
      tidy.globalOptions = opts;

      const root = postcss.parse('a{}');
      const rule = root.first;
      tidy.initRule(rule);

      expect(tidy.getSharedGap(rule)).toBe(output);
    },
  );
});

describe('Checking values passed to Columns.buildCalcFunction()', () => {
  const tidy = new TidyColumns();
  tidy.globalOptions = allValues;
  jest.spyOn(tidy, 'buildCalcFunction');

  const root = postcss.parse('a{}');
  const rule = root.first;
  tidy.initRule(rule);

  describe('From spanCalc', () => {
    test('Fractional columns (lower than 1)', () => {
      tidy.spanCalc(0.5);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(0.5, -0);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(0.5, -0);
    });

    test('Single column', () => {
      tidy.spanCalc(1);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1, 0);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1, 0);
    });

    test('Fractional columns (greater than 1)', () => {
      tidy.spanCalc(1.75);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
    });

    test('Fractional columns (greater than 2)', () => {
      tidy.spanCalc(2.5);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
    });
  });

  describe('From offsetCalc', () => {
    test('Fractional columns (lower than 1)', () => {
      tidy.offsetCalc(0.5);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(0.5, 0);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(0.5, 0);
    });

    test('Single column', () => {
      tidy.offsetCalc(1);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1, 1);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1, 1);
    });

    test('Fractional columns (greater than 1)', () => {
      tidy.offsetCalc(1.75);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(1.75, 1);
    });

    test('Fractional columns (greater than 2)', () => {
      tidy.offsetCalc(2.5);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
      expect(tidy.buildCalcFunction).toHaveBeenCalledWith(2.5, 2);
    });
  });
});

describe('Get calc functions from spanCalc()', () => {
  test.each([
    [
      'Single column.',
      1,
      'calc((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem)',
    ],
    [
      'Two columns (one gap).',
      2,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)',
    ],
    [
      'Multiple columns.',
      4,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
    ],
    [
      'Fractional columns (less than 1)',
      0.5,
      'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.5)',
    ],
    [
      'Fractional columns (greater than 1)',
      1.75,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
    ],
    [
      'Fractional columns (greater than 2)',
      2.5,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
    ],
    [
      'Omits a `full` value with no `max` option',
      1,
      'calc((100vw - 1rem * 2) / 12 - 9.1667px)',
      edgeGap,
    ],
    [
      'Omits shared gap for single column with no `gap` option',
      1,
      'calc((min(100vw, 1024px) - 1.25rem * 2) / 16)',
      edgeMax,
    ],
    [
      'Omits the gap addition wtih no `gap` option',
      2,
      'calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)',
      edgeMax,
    ],
    [
      'Omits the edge subtraction with no `edge` option',
      1,
      'calc(min(100vw, 60rem) / 16 - 14.0625px)',
      gapMax,
    ],
    [
      'Omits undeclared values from span ouput: `edge` only',
      1,
      'calc((100vw - 20px * 2) / 12)',
      edgeOnly,
    ],
    [
      'Omits undeclared values from span ouput: `gap` only',
      1,
      'calc(100vw / 12 - 0.8594rem)',
      gapOnly,
    ],
    [
      'Omits undeclared values from span ouput: `max` only',
      1,
      'calc(min(100vw, var(--tmax)) / 16)',
      maxOnly,
    ],
    [
      'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      5,
      'calc((min(100vw, var(--tmax)) / 16) * 5)',
      maxOnly,
    ],
    [
      'Omits undeclared values from span ouput: `columns` only',
      1,
      'calc(100vw / 12)',
      columnsOnly,
    ],
    [
      'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      3,
      'calc((100vw / 12) * 3)',
      columnsOnly,
    ],
    [
      'Custom properties used in option values',
      3,
      'calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 2)',
      customProperties,
    ],
    [
      'var() function for `max` value',
      3,
      'calc((((min(100vw, var(--tmax)) - 32px * 2) / 16 - 0.5859rem) * 3) + 0.625rem * 2)',
      { ...allValues, max: 'var(--tmax)' },
    ],
    [
      'var() function for `edge` value',
      3,
      'calc((((min(100vw, 75rem) - var(--tedge) * 2) / 16 - 0.5859rem) * 3) + 0.625rem * 2)',
      { ...allValues, edge: 'var(--tedge)' },
    ],
    [
      'var() function for `gap` value',
      3,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - (var(--tgap) / 16 * (16 - 1))) * 3) + var(--tgap) * 2)',
      { ...allValues, gap: 'var(--tgap)' },
    ],
    [
      'var() function for `columns` value',
      3,
      'calc((((min(100vw, 75rem) - 32px * 2) / var(--tcolumns) - (0.625rem / var(--tcolumns) * (var(--tcolumns) - 1))) * 3) + 0.625rem * 2)',
      { ...allValues, columns: 'var(--tcolumns)' },
    ],
    [
      '`base` option applied as expected: %',
      1,
      'calc(100% / 12)',
      { ...columnsOnly, base: '%' },
    ],
    [
      '`base` option applied as expected: \'px\' ignored',
      1,
      'calc(100vw / 12)',
      { ...columnsOnly, base: 'px' },
    ],
  ])(
    '%O',
    (desc, input, output, opts = allValues) => {
      const tidy = new TidyColumns();
      tidy.globalOptions = opts;

      const root = postcss.parse('a{}');
      const rule = root.first;
      tidy.initRule(rule);

      expect(tidy.spanCalc(input)).toBe(output);
    },
  );

  test('`reduce` option changes output', () => {
    const tidy = new TidyColumns();
    tidy.globalOptions = { ...allValues, reduce: true };

    const root = postcss.parse('a{}');
    const rule = root.first;
    tidy.initRule(rule);

    expect(tidy.spanCalc(2))
      .not.toBe('calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem)');
  });
});

describe('Get calc functions from offsetCalc()', () => {
  test.each([
    [
      'Single column',
      1,
      'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
    ],
    [
      'Two columns (two gaps)',
      2,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2) + 0.625rem * 2)',
    ],
    [
      'Multiple columns',
      4,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 4)',
    ],
    [
      'Fractional columns (less than 1)',
      0.75,
      'calc(((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 0.75)',
    ],
    [
      'Fractional columns (greater than 1)',
      1.5,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
    ],
    [
      'Fractional columns (greater than 2)',
      2.075,
      'calc((((min(100vw, 75rem) - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
    ],
    [
      'Omits a `full` value with no `max` option',
      1,
      'calc(((100vw - 1rem * 2) / 12 - 9.1667px) + 10px)',
      edgeGap,
    ],
    [
      'Omits shared gap for single column with no `gap` option',
      1,
      'calc((min(100vw, 1024px) - 1.25rem * 2) / 16)',
      edgeMax,
    ],
    [
      'Omits the gap addition wtih no `gap` option',
      2,
      'calc(((min(100vw, 1024px) - 1.25rem * 2) / 16) * 2)',
      edgeMax,
    ],
    [
      'Omits the edge subtraction with no `edge` option',
      1,
      'calc((min(100vw, 60rem) / 16 - 14.0625px) + 15px)',
      gapMax,
    ],
    [
      'Omits undeclared values from span ouput: `edge` only',
      1,
      'calc((100vw - 20px * 2) / 12)',
      edgeOnly,
    ],
    [
      'Omits undeclared values from span ouput: `edge` only (multiple columns)',
      2,
      'calc(((100vw - 20px * 2) / 12) * 2)',
      edgeOnly,
    ],
    [
      'Omits undeclared values from span ouput: `gap` only',
      1,
      'calc((100vw / 12 - 0.8594rem) + 0.9375rem)',
      gapOnly,
    ],
    [
      'Omits undeclared values from span ouput: `max` only',
      1,
      'calc(min(100vw, var(--tmax)) / 16)',
      maxOnly,
    ],
    [
      'Omits undeclared values from span ouput: `columns` only',
      1,
      'calc(100vw / 12)',
      columnsOnly,
    ],
    [
      'Omits undeclared values from span ouput: `columns` only (multiple columns)',
      4,
      'calc((100vw / 12) * 4)',
      columnsOnly,
    ],
    [
      'Custom properties used in option values',
      3,
      'calc((((min(100vw, 90rem) - var(--edge) * 2) / var(--columns) - (var(--gap) / var(--columns) * (var(--columns) - 1))) * 3) + var(--gap) * 3)',
      customProperties,
    ],
  ])(
    '%O',
    (desc, input, output, opts = allValues) => {
      const tidy = new TidyColumns();
      tidy.globalOptions = opts;

      const root = postcss.parse('a{}');
      const rule = root.first;
      tidy.initRule(rule);

      expect(tidy.offsetCalc(input)).toBe(output);
    },
  );
});
