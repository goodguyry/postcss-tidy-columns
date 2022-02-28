const { getOptions } = require('./src/lib/options');
const {
  isCustomProperty,
  roundToPrecision,
  isEmpty,
} = require('./src/lib/values');
const transformValue = require('./src/transformValue');
const { normalizeOptions } = require('./src/lib/options');

/**
 * TidyColumns class
 * Initialize options, calculate column and offset values.
 *
 * @param {Object} options The plugin options.
 */
class TidyColumns {
  constructor() {
    this.initRoot = this.initRoot.bind(this);
    this.initRule = this.initRule.bind(this);
    this.getSharedGap = this.getSharedGap.bind(this);
    this.getSingleColumn = this.getSingleColumn.bind(this);
    this.buildCalcFunction = this.buildCalcFunction.bind(this);
    this.spanCalc = this.spanCalc.bind(this);
    this.offsetCalc = this.offsetCalc.bind(this);

    /**
     * Suppress the `calc` string in the column output.
     *
     * @type {Boolean}
     */
    this.suppressCalc = false;
  }

  /**
   * Collect the global options.
   *
   * @param {Root} root The CSS root.
   */
  initRoot(root, options) {
    this.globalOptions = Object.freeze(getOptions(root, options));
  }

  /**
   * Set up rule-specific properties.
   *
   * @param {Rule} rule The current rule.
   */
  initRule(rule) {
    // Merge global and local options.
    const ruleOptions = getOptions(rule, this.globalOptions);

    /**
     * Rule options.
     *
     * @type {Object}
     */
    this.ruleOptions = normalizeOptions(ruleOptions);

    const { edge, base = 'vw', max } = this.ruleOptions;
    const fluidBase = `100${base}`;

    /**
     * The `baseValue` used in column and offset expressions.
     *
     * @type {String}
     */
    this.baseValue = (undefined !== max) ? `min(${fluidBase}, ${max})` : fluidBase;

    /**
     * The `edges` expression.
     *
     * @type {Number|String}
     */
    this.edges = isEmpty(edge) ? 0 : `${edge} * 2`;

    /**
     * The `sharedGap` expression.
     *
     * @type {Number|String}
     */
    this.sharedGap = this.getSharedGap();
  }

  /**
   * Calculate the shared gap amount to be removed from each column.
   *
   * @return {String|Number}
   */
  getSharedGap() {
    const { gap, columns } = this.ruleOptions;

    // Can't divide a string representing an unknown value.
    if (isCustomProperty(gap) || isCustomProperty(columns)) {
      return `(${gap} / ${columns} * (${columns} - 1))`;
    }

    if (isEmpty(gap)) {
      return 0;
    }

    // Split the value from the units.
    const [value, units] = ('string' === typeof gap)
      ? [parseFloat(gap), gap.replace(/[\d.]/g, '')]
      : [gap, undefined];

    const sharedGap = (value / columns) * (columns - 1);

    return `${roundToPrecision(sharedGap, 4)}${units}`;
  }

  /**
   * Build the column division for the appropriate base value and gaps.
   *
   * @param {String} base The current base value size.
   * @return {String}
   */
  getSingleColumn() {
    const { columns } = this.ruleOptions;

    // The expression for the container without edges.
    const container = isEmpty(this.edges)
      ? this.baseValue
      : `(${this.baseValue} - ${this.edges})`;

    // The expression for reducing the column by a shared gap amount.
    const columnDenominator = (this.sharedGap)
      ? `${columns} - ${this.sharedGap}`
      : `${columns}`;

    return `${container} / ${columnDenominator}`;
  }

  /**
   * Complete the calc() function.
   *
   * @param {Number} colSpan The number of columns to span.
   * @param {Number} gapSpan The number of gaps to span.
   * @return {String}
   */
  buildCalcFunction(colSpan, gapSpan) {
    const { gap, reduce } = this.ruleOptions;

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
    if (!isEmpty(gap) && !isEmpty(gapSpan)) {
      const gapSpanCalc = (1 === gapSpan) ? gap : `${gap} * ${gapSpan}`;

      cssCalcEquation = `(${cssCalcEquation}) + ${gapSpanCalc}`;
    }

    // Conditionally reduce the expression.
    return reduce
      ? transformValue(`(${cssCalcEquation})`, this.suppressCalc)
      : `${this.suppressCalc ? '' : 'calc'}(${cssCalcEquation})`;
  }

  /**
   * Create the column `calc()` function declaration for each base value.
   *
   * @param {String|Number} colSpan The number of columns to span.
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
   * @return {Object}
   */
  offsetCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);

    // Round columnSpan down to account for fractional columns.
    const gapSpan = Math.floor(columnSpan);

    return this.buildCalcFunction(columnSpan, gapSpan);
  }
}

module.exports = TidyColumns;
