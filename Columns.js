const { CUSTOM_PROP_REGEX } = require('./src/collectTidyRuleParams');
const ROUNDING_PRECISION = require('./lib/roundingPrecision');

/**
 * Columns class
 * Calculate column and offset values based on processed options.
 *
 * @param {Object} options The options for the current rule.
 */
class Columns {
  /**
   * Round the given number to the specified number of decimal places.
   *
   * @param {Number} toRound       The number to round.
   * @param {Number} decimalPlaces The number of decimal places to round `toRound` to.
   *
   * @return {Number}
   */
  static roundToPrecision(toRound, decimalPlaces = ROUNDING_PRECISION) {
    const precision = `1${'0'.repeat(decimalPlaces)}`;

    return (0 === toRound) ? 0 : Math.round((toRound + 0.00001) * precision) / precision;
  }

  /**
   * Separate a CSS length value's number from its units.
   *
   * @param {String} value A CSS length value.
   *
   * @return {Array}
   */
  static splitCssUnit(value) {
    return ('string' === typeof value)
      ? [parseFloat(value), value.replace(/[\d.]/g, '')]
      : value;
  }

  /**
   * Check for matching units.
   *
   * @param {Arguments} units Argument list of units to check.
   *
   * @return {String}
   */
  static haveSameValues(...units) {
    const set = new Set(units);
    const { value } = set.values().next();

    return (1 === set.size && undefined !== value) ? value : false;
  }

  /**
   * Returns true if the value is a CSS Custom Property.
   *
   * @param {String} value A CSS property value.
   *
   * @return {Boolean}
   */
  static isCustomProperty(value) {
    return CUSTOM_PROP_REGEX.test(value);
  }

  constructor(options = {}) {
    this.options = options;

    // Collect siteMaxValues to be used in column and offset calc() functions.
    this.siteMaxValues = ['100vw'];
    if (undefined !== this.options.siteMax) {
      this.siteMaxValues.push(this.options.siteMax);
    }

    this.fullWidthRule = null;
    this.nonValues = [undefined, 0];

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

    if (this.constructor.isCustomProperty(gap)) {
      return `(${gap} / ${columns} * (${columns} - 1))`;
    }

    if (!this.nonValues.includes(gap)) {
      const [value, units] = this.constructor.splitCssUnit(gap);
      const sharedGap = (value / columns) * (columns - 1);

      return `${this.constructor.roundToPrecision(sharedGap)}${units}`;
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

    // Force `0` for missing or invalid values.
    if (this.nonValues.includes(edge)) {
      return 0;
    }

    // Don't reduce math for Custom Properties.
    if (this.constructor.isCustomProperty(edge)) {
      return `${edge} * 2`;
    }

    const [value, units] = this.constructor.splitCssUnit(edge);
    const product = (value * 2);

    return `${product}${units}`;
  }

  /**
   * Build the column division for the appropriate siteMax and gaps.
   *
   * @param {String} siteMax The current siteMax size.
   *
   * @return {String}
   */
  getSingleColumn(siteMax) {
    const { columns } = this.options;
    // 100vw : (100vw - 10px * 2)
    const siteMaxSize = this.nonValues.includes(this.edges)
      ? siteMax
      : `(${siteMax} - ${this.edges})`;

    // 12 - 9.1667px : 12
    const columnReduction = (this.sharedGap)
      ? `${columns} - ${this.sharedGap}`
      : `${columns}`;

    return `${siteMaxSize} / ${columnReduction}`;
  }

  /**
   * Complete the calc() function.
   *
   * @param {String}  siteMax The current siteMax size.
   * @param {Number}  colSpan The number of columns to span.
   * @param {Number}  gapSpan The number of gaps to span.
   *
   * @return {String}
   */
  buildCalcFunction(siteMax, colSpan, gapSpan) {
    const { gap, edge, columns } = this.options;
    const expressions = [];
    let cssCalcEquation = '';
    const hasCustomProperty = this.constructor.isCustomProperty(gap)
      || this.constructor.isCustomProperty(edge)
      || this.constructor.isCustomProperty(columns);

    if (hasCustomProperty) {
      // The base calc() equation.
      cssCalcEquation = this.getSingleColumn(siteMax);

      // Only multiply columns if there are more than one.
      if (1 !== colSpan) {
        cssCalcEquation = `(${cssCalcEquation}) * ${colSpan}`;
      }
    } else {
      const theProduct = value => value * colSpan;

      const [siteMaxValue, siteMaxUnits] = this.constructor.splitCssUnit(siteMax);
      expressions.push(`${theProduct(siteMaxValue / columns)}${siteMaxUnits}`);

      if (!this.nonValues.includes(this.edges)) {
        const [edgesValue, edgesUnits] = this.constructor.splitCssUnit(this.edges);
        const edges = this.constructor.roundToPrecision(theProduct(edgesValue / columns));
        expressions.push(`${edges}${edgesUnits}`);
      }

      if (this.sharedGap) {
        const [sharedGapValue, sharedGapUnits] = this.constructor.splitCssUnit(this.sharedGap);
        const gaps = this.constructor.roundToPrecision(theProduct(sharedGapValue));
        expressions.push(`${gaps}${sharedGapUnits}`);
      }

      cssCalcEquation = expressions.join(' - ');
    }

    // Capture the array intersect.
    const filteredArray = [gap, gapSpan].filter(value => this.nonValues.includes(value));

    // Check for gaps before adding the math for them.
    if (filteredArray.length < 1) {
      let gapSpanCalc = gap;

      // Only multiply gaps if there are more or fewer than one.
      if (1 !== gapSpan) {
        if (this.constructor.isCustomProperty(gap)) {
          // Don't reduce math for Custom Properties.
          gapSpanCalc = `${gap} * ${gapSpan}`;
        } else {
          const [value, units] = this.constructor.splitCssUnit(gap);
          gapSpanCalc = `${value * gapSpan}${units}`;
        }
      }

      // Format differs when we're outputting Custom Properties.
      cssCalcEquation = hasCustomProperty
        ? `(${cssCalcEquation}) + ${gapSpanCalc}`
        : `${cssCalcEquation} + ${gapSpanCalc}`;
    }

    return `${this.suppressCalc ? '' : 'calc'}(${cssCalcEquation})`;
  }

  /**
   * Create the column `calc()` function declaration for each siteMax.
   *
   * @param {String|Number} colSpan The number of columns to span.
   *
   * @return {Object}
   */
  spanCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);
    const [fluid, full] = this.siteMaxValues.map((siteMax) => {
      /**
       * Subtract from columnSpan, then round up to account for fractional columns.
       * We are *always* spanning one more column than gap.
       * Ensure we maintain the sign of the columnSpan value.
       */
      const gapSpan = Math.ceil(columnSpan + (Math.sign(columnSpan) * -1));

      return this.buildCalcFunction(siteMax, columnSpan, gapSpan);
    });

    return { fluid, full };
  }

  /**
   * Create the offset `calc()` function declaration for each siteMax.
   *
   * @param {String|Number} colSpan      The number of columns to offset.
   * @param {Boolean}       suppressCalc Suppress the `calc` string in the output.
   *
   * @return {Object}
   */
  offsetCalc(colSpan) {
    const columnSpan = parseFloat(colSpan, 10);
    const [fluid, full] = this.siteMaxValues.map((siteMax) => {
      // Round columnSpan down to account for fractional columns.
      const gapSpan = Math.floor(columnSpan);

      return this.buildCalcFunction(siteMax, columnSpan, gapSpan);
    });

    return { fluid, full };
  }
}

module.exports = Columns;
