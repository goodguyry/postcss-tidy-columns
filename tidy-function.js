const cleanClone = require('./lib/cleanClone');
const detectCalcWrapper = require('./lib/detectCalcWrapper');

/**
 * Pattern to match `tidy-*` functions in declaration values.
 *
 * @type {RegExp}
 */
const FUNCTION_REGEX = /tidy-(span|offset)\(([\d.-]+)\)/;

/**
 * Replace `tidy-[span|offset]()` functions.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#span-function
 * @see https://github.com/goodguyry/postcss-tidy-columns#offset-function
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} Tidy        An instance of the Tidy class.
 * @param {Result} result      Provides the result of the PostCSS transformations.
 */
function tidyFunction(declaration, tidy, result) {
  // Parse the tidy-* function matches.
  const tidyMatches = detectCalcWrapper(declaration.value);

  if (0 < tidyMatches.length) {
    const { columns, columns: { options } } = tidy;

    /**
     * Find all matches in the declaration value.
     *
     * @param {String} acc       The accumulator, based on declaration.value
     * @param {String} tidyMatch The full tidy function match(es).
     *
     * @return {String}          The replacement value for the declaration.
     */
    const replaceWithValue = tidyMatches.reduce((acc, tidyMatch) => {
      const { match: tidyFunctionMatch, isNested } = tidyMatch;

      // Conditionally suppress 'calc' in the output.
      columns.suppressCalc = isNested;

      /**
       * match: The full function expression.
       * slug:  One of either `span` or `offset`.
       * value: The function's argument.
       */
      const [match, slug, value] = tidyFunctionMatch.match(FUNCTION_REGEX);

      /**
       * Get the span or offset `calc()` value(s).
       * Use the object's `isNested` value to suppress the `calc` from the output.
       */
      const calcValue = ('span' === slug)
        ? columns.spanCalc(value)
        : columns.offsetCalc(value);

      return acc.replace(match, calcValue);
    }, declaration.value);

    if (options.debug) {
      result.warn(`Debug: ${result.opts.from} => ${declaration.toString()}`, { node: declaration });
    }

    // Replace declaration(s) with cloned and updated declarations.
    declaration.replaceWith(cleanClone(
      declaration,
      {
        prop: declaration.prop,
        value: replaceWithValue,
      },
    ));

    // Reset suppress 'calc' to default.
    columns.suppressCalc = false;
  }
}

module.exports = {
  tidyFunction,
  FUNCTION_REGEX,
};
