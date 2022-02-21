const { isCustomProperty } = require('./lib/isCustomProperty');
const roundToPrecision = require('./lib/roundToPrecision');
const splitCssUnit = require('./lib/splitCssUnit');
const hasEmptyValue = require('./lib/hasEmptyValue');
const transformValue = require('./lib/transformValue');

/**
 * Columns class
 * Calculate column and offset values based on processed options.
 *
 * @param {Object} options The options for the current rule.
 */
class Columns {
  constructor(options = {}) {
    this.options = options;

    // Collect baseValues to be used in column and offset calc() functions.
    const fluidBase = '100vw';
    this.baseValue = (undefined !== this.options.max)
      ? `min(${fluidBase}, ${this.options.max})`
      : fluidBase;

    this.fullWidthRule = null;

    // Bind class methods.
    this.getSharedGap = this.getSharedGap.bind(this);
    this.getEdges = this.getEdges.bind(this);
    this.getSingleColumn = this.getSingleColumn.bind(this);
    this.buildCalcFunction = this.buildCalcFunction.bind(this);
    this.spanCalc = this.spanCalc.bind(this);
    this.offsetCalc = this.offsetCalc.bind(this);

    this.edges = this.getEdges();
    this.sharedGap = this.getSharedGap();

    /**
     * Suppress the `calc` string in the column output.
     *
     * @type {Boolean}
     */
    this.suppressCalc = false;
  }

  /**
   * Calculate the shared gap amount to be removed from each column.
   *
   * @return {String|Number}
   */
  getSharedGap() {
    const { gap, columns } = this.options;

    if (isCustomProperty(gap)) {
      return `(${gap} / ${columns} * (${columns} - 1))`;
    }

    if (!hasEmptyValue(gap)) {
      const [value, units] = splitCssUnit(gap);
      const sharedGap = (value / columns) * (columns - 1);

      return `${roundToPrecision(sharedGap, 4)}${units}`;
    }

    return 0;
  }

  /**
   * Calculate the total edge spacing.
   *
   * @return {String|Number}
   */
  getEdges() {
    const { edge } = this.options;

    return hasEmptyValue(edge) ? 0 : `${edge} * 2`;
  }

  /**
   * Build the column division for the appropriate base value and gaps.
   *
   * @param {String} base The current base value size.
   *
   * @return {String}
   */
  getSingleColumn() {
    const { columns } = this.options;
    // 100vw : (100vw - 10px * 2)
    const baseValue = hasEmptyValue(this.edges)
      ? this.baseValue
      : `(${this.baseValue} - ${this.edges})`;

    // 12 - 9.1667px : 12
    const columnReduction = (this.sharedGap)
      ? `${columns} - ${this.sharedGap}`
      : `${columns}`;

    return `${baseValue} / ${columnReduction}`;
  }

  /**
   * Complete the calc() function.
   *
   * @param {Number} colSpan The number of columns to span.
   * @param {Number} gapSpan The number of gaps to span.
   *
   * @return {String}
   */
  buildCalcFunction(colSpan, gapSpan) {
    const { gap, reduce } = this.options;

    // The base calc() equation.
    let cssCalcEquation = this.getSingleColumn();

    // Only multiply columns if there are more than one.
    if (1 !== colSpan) {
      cssCalcEquation = `(${cssCalcEquation}) * ${colSpan}`;
    }

    /**
     * Check for gaps before adding the math for them.
     * Only multiply gaps if there are more than one.
     */
    if (!hasEmptyValue(gap) && !hasEmptyValue(gapSpan)) {
      const gapSpanCalc = (1 === gapSpan) ? gap : `${gap} * ${gapSpan}`;

      cssCalcEquation = `(${cssCalcEquation}) + ${gapSpanCalc}`;
    }

    // Conditionally educe the expression.
    return reduce
      ? transformValue(`(${cssCalcEquation})`, this.suppressCalc)
      : `${this.suppressCalc ? '' : 'calc'}(${cssCalcEquation})`;
  }

  /**
   * Create the column `calc()` function declaration for each base value.
   *
   * @param {String|Number} colSpan The number of columns to span.
   *
   * @return {Object}
   */
  spanCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);

    /**
     * Subtract from columnSpan, then round up to account for fractional columns.
     * We are *always* spanning one more column than gap.
     * Ensure we maintain the sign of the columnSpan value.
     */
    const gapSpan = Math.ceil(columnSpan + (Math.sign(columnSpan) * -1));

    return this.buildCalcFunction(columnSpan, gapSpan);
  }

  /**
   * Create the offset `calc()` function declaration for each base value.
   *
   * @param {String|Number} colSpan The number of columns to offset.
   *
   * @return {Object}
   */
  offsetCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);

    // Round columnSpan down to account for fractional columns.
    const gapSpan = Math.floor(columnSpan);

    return this.buildCalcFunction(columnSpan, gapSpan);
  }
}

module.exports = Columns;
