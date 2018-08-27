const { varPattern } = require('./lib/normalize-options');

/**
 * Grid class
 * Calculate column and offset values based on processed options.
 *
 * @param {Object} options The options for the current rule.
 */
class Grid {
  /**
   * Round the given number to the specified number of decimal places.
   *
   * @param {Number} toRound       The number to round.
   * @param {Number} decimalPlaces The number of decimal places to round `toRound` to.
   *
   * @returns {Number}
   */
  static roundToPrecision(toRound, decimalPlaces) {
    const precision = `1${'0'.repeat(decimalPlaces)}`;

    return (0 === toRound) ? 0 : Math.round((toRound + 0.00001) * precision) / precision;
  }

  /**
   * Separate a CSS length value's number from its units.
   *
   * @param {String} value A CSS length value.
   *
   * @returns {Array}
   */
  static splitCssUnit(value) {
    return ('string' === typeof value) ?
      [parseFloat(value), value.replace(/[\d.]/g, '')] :
      value;
  }

  constructor(options = {}) {
    this.options = options;

    // Collect siteMaxValues to be used in column and offset calc() functions.
    this.siteMaxValues = ['100vw'];
    if (undefined !== this.options.siteMax) {
      this.siteMaxValues.push(this.options.siteMax);
    }

    this.fullWidthRule = null;
    this.shouldAddGapDecl = false;

    // Bind class methods.
    this.getSharedGap = this.getSharedGap.bind(this);
    this.getEdges = this.getEdges.bind(this);
    this.getSingleColumn = this.getSingleColumn.bind(this);
    this.buildCalcFunction = this.buildCalcFunction.bind(this);
    this.spanCalc = this.spanCalc.bind(this);
    this.offsetCalc = this.offsetCalc.bind(this);

    this.edges = this.getEdges();
    this.sharedGap = this.getSharedGap();
  }

  /**
   * Calculate the shared gap amount to be removed from each column.
   *
   * @returns {String|Number}
   */
  getSharedGap() {
    const { gap, columns } = this.options;

    if (varPattern.test(gap)) {
      return `(${gap} / ${columns} * (${columns} - 1))`;
    }

    if (undefined !== gap) {
      const [value, units] = this.constructor.splitCssUnit(gap);
      const sharedGap = (value / columns) * (columns - 1);
      return `${this.constructor.roundToPrecision(sharedGap, 4)}${units}`;
    }

    return 0;
  }

  /**
   * Calculate the total edge spacing.
   *
   * @returns {String|Number}
   */
  getEdges() {
    const { edge } = this.options;

    if (varPattern.test(edge)) {
      return `${edge} * 2`;
    }

    return (undefined === edge) ? 0 : `${edge} * 2`;
  }

  /**
   * Build the column division for the appropriate siteMax and gaps.
   *
   * @param {String} siteMax The current siteMax size.
   *
   * @returns {String}
   */
  getSingleColumn(siteMax) {
    const { columns } = this.options;
    // 100vw : (100vw - 10px * 2)
    const siteMaxSize = 0 === this.edges ?
      siteMax :
      `(${siteMax} - ${this.edges})`;

    // 12 - 9.1667px : 12
    const columnReduction = (this.sharedGap) ?
      `${columns} - ${this.sharedGap}` :
      `${columns}`;

    return `${siteMaxSize} / ${columnReduction}`;
  }

  /**
   * Complete the calc() function.
   *
   * @param {String} siteMax The current siteMax size.
   * @param {Number} colSpan The number of columns to span.
   * @param {Number} gapSpan The number of gaps to span.
   *
   * @returns {String}
   */
  buildCalcFunction(siteMax, colSpan, gapSpan) {
    const { gap } = this.options;

    // The base calc() equation.
    let cssCalcEquation = this.getSingleColumn(siteMax);

    // Only multiply columns if there are more than one.
    if (1 !== colSpan) {
      cssCalcEquation = `(${cssCalcEquation}) * ${colSpan}`;
    }

    /**
     * Check for gaps before adding the math for them.
     * Only multiply gaps if there are more than one.
     */
    if (undefined !== gap && 0 !== gapSpan) {
      const gapSpanCalc = (1 === gapSpan) ? gap : `${gap} * ${gapSpan}`;

      cssCalcEquation = `(${cssCalcEquation}) + ${gapSpanCalc}`;
    }

    return `calc(${cssCalcEquation})`;
  }

  /**
   * Create the column `calc()` function declaration for each siteMax.
   *
   * @param {String|Number} colSpan The number of columns to span.
   *
   * @returns {Object}
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
   * @param {String|Number} colSpan The number of columns to offset.
   *
   * @returns {Object}
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

module.exports = Grid;
