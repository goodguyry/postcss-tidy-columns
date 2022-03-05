const { getOptions } = require('./src/lib/options');
const {
  isCustomProperty,
  roundToPrecision,
  isEmpty,
} = require('./src/lib/values');
const transformValue = require('./src/transformValue');

/**
 * TidyColumns class
 * Calculates column and offset values.
 */
class TidyColumns {
  /**
   * Creates a new TidyColumns.
   *
   * @constructor
   * @param {Object} options The plugin options.
   */
  constructor(options = {}) {
    /**
     * Options set via the PostCSS config.
     *
     * @type {Object}
     */
    this.pluginOptions = options;

    // Bind class methods.
    this.initRoot = this.initRoot.bind(this);
    this.initRule = this.initRule.bind(this);
    this.getSharedGap = this.getSharedGap.bind(this);
    this.getSingleColumn = this.getSingleColumn.bind(this);
    this.buildCalcFunction = this.buildCalcFunction.bind(this);
    this.spanCalc = this.spanCalc.bind(this);
    this.offsetCalc = this.offsetCalc.bind(this);

    /**
     * Whether to suppress the `calc` string in the column output.
     *
     * @type {Boolean}
     */
    this.suppressCalc = false;
  }

  /**
   * Collects global options from the CSS root.
   *
   * @param {Root} root The CSS root.
   */
  initRoot(root) {
    this.globalOptions = Object.freeze(getOptions(root, this.pluginOptions));
  }

  /**
   * Collects rule-specific options and initialize column properties and values.
   *
   * @param {Rule} rule The current rule.
   */
  initRule(rule) {
    /**
     * Rule options merged into global options.
     *
     * @type {Object}
     */
    this.ruleOptions = getOptions(rule, this.globalOptions);

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
     * @type {String}
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
   * Calculates the amount to be removed from each column.
   *
   * @return {String} The shared gap expression or CSS length value.
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
   * Builds the column expression for the appropriate base value and gaps.
   *
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

    // E.x., min(100vw, 80rem) - 1.25rem / 12 - 0.5859rem
    return `${container} / ${columnDenominator}`;
  }

  /**
   * Builds the calc() function.
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
     */
    if (!isEmpty(gap) && !isEmpty(gapSpan)) {
      // Only multiply gaps if there are more than one.
      const gapSpanCalc = (1 === gapSpan) ? gap : `${gap} * ${gapSpan}`;

      cssCalcEquation = `(${cssCalcEquation}) + ${gapSpanCalc}`;
    }

    // Conditionally reduce the expression.
    return reduce
      ? transformValue(`(${cssCalcEquation})`, this.suppressCalc)
      // Conditionally wrap in a calc() function
      : `${this.suppressCalc ? '' : 'calc'}(${cssCalcEquation})`;
  }

  /**
   * Creates the column `calc()` function declaration for each base value.
   *
   * @param {String|Number} colSpan The number of columns to span.
   * @return {String}
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
   * Creates the offset `calc()` function declaration for each base value.
   *
   * @param {String|Number} colSpan The number of columns to offset.
   * @return {String}
   */
  offsetCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);

    // Round columnSpan down to account for fractional columns.
    const gapSpan = Math.floor(columnSpan);

    return this.buildCalcFunction(columnSpan, gapSpan);
  }
}

module.exports = TidyColumns;
