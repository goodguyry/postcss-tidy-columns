const cleanClone = require('./lib/cleanClone');

/**
 * Pattern to match `tidy-*` functions in declaration values.
 *
 * @type {RegExp}
 */
const FUNCTION_PATTERN = /tidy-(span|offset)\(([\d.-]+)\)/;

/**
 * Extract tidy-span|offset functions and note whether they're nested within a CSS unction.
 *
 * @param  {String} value The declaration value.
 * @return {Array} [
 *   @type {Object} {
 *     An object describing any tidy-* functions found.
 *
 *     @type {Boolean} isNested Whether or not the tidy-* function is nested with a CSS function.
 *     @type {String}  match    The tidy-* function to replace.
 *   }
 * ]
 */
function getFunctionMatches(declaration) {
  const globalRegExp = new RegExp(FUNCTION_PATTERN, 'g');

  if (/calc/.test(declaration)) {
    // Split the declaration at the calc function(s).
    const calcSplit = declaration.split('calc');

    const calcResults = calcSplit
      // Ensure there is a calc() function within the string.
      .filter((split) => split.match(globalRegExp) && '' !== split)
      // Extract the string within balanced parentheses.
      .reduce((acc, piece) => {
        let balanced = false;
        let openingCount = 0;
        let closingCount = 0;

        let result = '';
        const results = [];

        [...piece].forEach((character) => {
          // Add the current character to the accumulator until we have a balanced string.
          result += character;

          // Keep count of the opening and closing parentheses.
          openingCount += Number('(' === character);
          closingCount += Number(')' === character);

          // The result string has balanced parentheses.
          balanced = ((0 !== openingCount + closingCount) && openingCount === closingCount);

          if (balanced) {
            let isNested = false;

            // Only work on strings containing a tidy-* function.
            if (globalRegExp.test(result)) {
              // Detect whether the balanced result is within a calc() function.
              const newRegex = new RegExp(`calc${result.replace(/([)(+-/*])/g, '\\$1')}`);
              isNested = newRegex.test(declaration);

              // Extract the tidy-* function and whether it's inside a calc() function.
              const [match] = piece.match(globalRegExp);
              results.push({
                match,
                isNested,
              });
            }

            // Reset values for next character.
            balanced = false;
            openingCount = 0;
            closingCount = 0;
            result = '';
          }
        });

        // Add the results to the accumulator
        return [...acc, ...results];
      }, []);

    return calcResults;
  }

  // Extract any tidy-* functions and note they are not nested.
  const matches = declaration.match(globalRegExp) || [];
  return matches
    // Filter out any falsy values.
    .filter((match) => match)
    .map((match) => ({ match, isNested: false }));
}

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
  const tidyMatches = getFunctionMatches(declaration.value);

  if (0 < tidyMatches.length) {
    const { ruleOptions } = tidy;

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
      tidy.suppressCalc = isNested; // eslint-disable-line no-param-reassign

      /**
       * match: The full function expression.
       * slug:  One of either `span` or `offset`.
       * value: The function's argument.
       */
      const [match, slug, value] = tidyFunctionMatch.match(FUNCTION_PATTERN);

      /**
       * Get the span or offset `calc()` value(s).
       */
      const calcValue = ('span' === slug)
        ? tidy.spanCalc(value)
        : tidy.offsetCalc(value);

      return acc.replace(match, calcValue);
    }, declaration.value);

    if (ruleOptions.debug) {
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
    tidy.suppressCalc = false; // eslint-disable-line no-param-reassign
  }
}

module.exports = {
  tidyFunction,
  getFunctionMatches,
  FUNCTION_PATTERN,
};
