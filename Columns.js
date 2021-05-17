const { isCustomProperty } = require('./lib/isCustomProperty');
const roundToPrecision = require('./lib/roundToPrecision');
const splitCssUnit = require('./lib/splitCssUnit');

/**
 * Columns class
 * Calculate column and offset values based on processed options.
 *
 * @param {Object} options The options for the current rule.
 */
class Columns {
  constructor(options = {}) {
    this.options = options;

    // Collect siteMaxValues to be used in column and offset calc() functions.
    this.siteMaxValues = ['100vw'];
    if (undefined !== this.options.siteMax) {
      this.siteMaxValues.push(this.options.siteMax);
    }

    this.fullWidthRule = null;
    this.nonValues = [undefined, 0, '0'];

    // Bind class methods.
    this.getSharedGap = this.getSharedGap.bind(this);
    this.getEdges = this.getEdges.bind(this);
    this.parseDeclarationOptions = this.parseDeclarationOptions.bind(this);
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

    /**
     * The declaration's options, parsed.
     *
     * @type {Object}
     */
    this.parsedOptions = this.parseDeclarationOptions();
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

    if (!this.nonValues.includes(gap)) {
      const [value, units] = splitCssUnit(gap);
      const sharedGap = (value / columns) * (columns - 1);

      return `${roundToPrecision(sharedGap)}${units}`;
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
    if (isCustomProperty(edge)) {
      return `${edge} * 2`;
    }

    const [value, units] = splitCssUnit(edge);
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
   * Parse and collect the current option values.
   *
   * @return {Object} Parsed options.
   */
  parseDeclarationOptions() {
    const collectedUnits = {};
    const [fluid, full] = this.siteMaxValues;
    const options = { ...this.options, siteMax: { fluid, full } };

    /**
     * Wrapper for reducing option values.
     *
     * @param  {Object} obj     The option values to reduce.
     * @param  {Object} initial The reduce method's initial value.
     * @return {Object}         The reduced options object.
     */
    const reducer = (obj, initial = {}) => Object.keys(obj).reduce((acc, key) => {
      // Collect siteMax values separately.
      if ('siteMax' === key) {
        const { hasCustomProperty } = acc;

        const {
          fluid: _fluid,
          full: _full,
        } = reducer(obj[key], { hasCustomProperty });

        return {
          ...acc,
          hasCustomProperty,
          siteMax: [
            _fluid,
            _full,
          ],
        };
      }

      const raw = obj[key];

      // Handle CSS Custom Preoperties.
      if (true === isCustomProperty(raw)) {
        acc.hasCustomProperty = true;

        return {
          ...acc,
          [key]: {
            raw,
          },
        };
      }

      const [value, units] = splitCssUnit(raw);

      // For now we ignore 'vw' units.
      if (!this.nonValues.includes(value) && ![undefined, 'vw'].includes(units)) {
        // Track how many of each unit values are found.
        if (undefined === collectedUnits[units]) {
          collectedUnits[units] = 0;
        } else {
          collectedUnits[units] += 1;
        }
      }

      return {
        ...acc,
        [key]: {
          raw,
          value: this.nonValues.includes(value) ? 0 : value,
          units,
          each: undefined,
        },
      };
    }, initial);

    // Get raw and parsed values for option properties.
    const parsedConfig = reducer(options, { hasCustomProperty: false });

    const {
      hasCustomProperty,
      columns: {
        raw: columns,
      },
      edge,
      gap,
    } = parsedConfig;

    let { siteMax } = parsedConfig;

    // Get per-column values.
    if (!hasCustomProperty) {
      /*
       * Even though `parsedSiteMax` can't be a Custom Property, we skip doing the
       * `each` math; Custom Properties output a differently-formatted `calc()`
       * function.
       */
      if (Array.isArray(siteMax) && 0 < siteMax.length) {
        siteMax = siteMax.map((option) => {
          const { value } = option;
          const product = roundToPrecision((value / columns));
          return {
            ...option,
            each: `${product}`,
          };
        });
      }

      if (undefined !== edge) {
        const { value } = edge;
        const product = roundToPrecision(((value * 2) / columns));
        edge.each = `${product}`;
      }

      if (undefined !== gap) {
        const { value } = gap;
        const product = roundToPrecision((value / columns) * (columns - 1));
        gap.each = `${product}`;
      }
    }

    // Get collectUnits values of items with more than on instance of the unit.
    let canReduce = false;
    const filteredUnits = Object.keys(collectedUnits).filter(key => 0 < collectedUnits[key]);

    /*
     * If there are no Custom Properties, check for unit value(s) used more than
     * once.
     */
    if (!parsedConfig.hasCustomProperty && (0 < filteredUnits.length)) {
      canReduce = filteredUnits;
    }

    return {
      canReduce,
      ...parsedConfig,
      siteMax,
      edge,
      gap,
    };
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
    const {
      hasCustomProperty,
      siteMax: siteMaxes,
      edge,
      gap,
    } = this.parsedOptions;

    const expressions = [];
    let cssCalcEquation = '';

    if (hasCustomProperty) {
      // The base calc() equation.
      cssCalcEquation = this.getSingleColumn(siteMax);

      // Only multiply columns if there are more than one.
      if (1 !== colSpan) {
        cssCalcEquation = `(${cssCalcEquation}) * ${colSpan}`;
      }
    } else {
      const theProduct = value => roundToPrecision(value * colSpan);

      // Get the siteMax value for this declaration.
      const [theSiteMax] = siteMaxes.filter(max => siteMax === max.raw);

      [theSiteMax, edge, gap].forEach((opt) => {
        const {
          raw,
          units,
          each,
        } = opt;

        if (!this.nonValues.includes(raw)) {
          expressions.push(`${theProduct(each)}${units}`);
        }
      });

      cssCalcEquation = expressions.join(' - ');
    }

    const {
      raw: gapRaw,
      value: gapValue,
      units: gapUnits,
    } = gap;

    // Capture the array intersect.
    const filteredArray = [gapRaw, gapSpan].filter(theValue => this.nonValues.includes(theValue));

    // Check for gaps before adding the math for them.
    if (filteredArray.length < 1) {
      let gapSpanCalc = gapRaw;

      // Only multiply gaps if there are more or fewer than one.
      if (1 !== gapSpan) {
        if (isCustomProperty(gapRaw)) {
          // Don't reduce math for Custom Properties.
          gapSpanCalc = `${gapRaw} * ${gapSpan}`;
        } else {
          gapSpanCalc = `${gapValue * gapSpan}${gapUnits}`;
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
