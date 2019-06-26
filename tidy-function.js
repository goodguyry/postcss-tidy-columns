const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const detectCalcWrapper = require('./lib/detectCalcWrapper');
const hasComment = require('./lib/hasComment');

/**
 * Pattern to match `tidy-*` functions in declaration values.
 *
 * @type {RegExp}
 */
const FUNCTION_REGEX = /tidy-(span|offset)(-full)?\(([\d.-]+)\)/;

/**
 * Replace `tidy-[span|offset]()` and `tidy-[span|offset]-full()` functions.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#span-function
 * @see https://github.com/goodguyry/postcss-tidy-columns#offset-function
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} Tidy        An instance of the Tidy class.
 */
function tidyFunction(declaration, tidy) {
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
       * match:    The full function expression.
       * slug:     One of either `span` or `offset`.
       * modifier: One of either `undefined` or `-full`.
       * value:    The function's argument.
       */
      const [match, slug, modifier, value] = tidyFunctionMatch.match(FUNCTION_REGEX);

      /**
       * Get the span or offset `calc()` value(s).
       * Use the object's `isNested` value to suppress the `calc` from the output.
       *
       * fluid: calc() function based on 100vw base.
       * full:  calc() function based on `siteMax` base.
       */
      const { fluid, full } = ('span' === slug)
        ? columns.spanCalc(value)
        : columns.offsetCalc(value);

      return ('-full' === modifier)
        // tidy-[span|offset]-full()
        ? acc.replace(match, full)
        // tidy-[span|offset] ()
        : acc.replace(match, fluid);
    }, declaration.value);

    // Save the original declaration in a comment for debugging.
    if (
      options.debug
      && undefined !== declaration.parent
      && !hasComment(declaration)
    ) {
      declaration.cloneBefore(postcss.comment({ text: declaration.toString() }));
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
