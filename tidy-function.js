/* eslint-disable no-param-reassign */
const cleanClone = require('./lib/cleanClone');
// const { stripExtraCalc } = require('./lib/stripExtraCalc');
const { detectCalcWrapper } = require('./lib/detectCalcWrapper');

/**
 * Pattern to match `tidy-*` functions in declaration values.
 *
 * @type {RegExp}
 */
const FUNCTION_REGEX = /tidy-(span|offset)(|-full)\(([\d.-]+)\)/;

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
  // const globalRegExp = new RegExp(FUNCTION_REGEX, 'g');
  const localRegExp = new RegExp(FUNCTION_REGEX);

  const matches = detectCalcWrapper(declaration.value);
  // use the new detection function here to parse the matches
  // if matches, then...
  if (matches) {
    const { columns } = tidy;
    // i already have this from the detect function
    // const fullMatch = declaration.value.match(globalRegExp);
    // console.log(fullMatch);

    /**
     * Find all matches in the declaration value.
     *
     * @param {String} acc       The accumulator, based on declaration.value
     * @param {String} tidyMatch The full tidy function match(es).
     *
     * @return {String}          The replacement value for the declaration.
     */
    // We're now reducing an array of objects: { match, isNested }
    const replaceWithValue = matches.reduce((acc, tidyMatch) => {
      /**
       * match:    The full function expression.
       * slug:     One of either `span` or `offset`.
       * modifier: One of either `undefined` or `-full`.
       * value:    The function's argument.
       */
      // This needs to use the object's `match` value
      const [match, slug, modifier, value] = tidyMatch.match.match(localRegExp);

      /**
       * Get the span or offset `calc()` value(s).
       *
       * fluid: calc() function based on 100vw base.
       * full:  calc() function based on `siteMax` base.
       */
      let { fluid, full } = ('span' === slug) ?
        columns.spanCalc(value) :
        columns.offsetCalc(value);

      // Use the object's `isNested` value to remove the `calc` from { full, fluid }
      if (tidyMatch.isNested) {
        full = full.replace('calc', '');
        fluid = fluid.replace('calc', '');
      }

      acc = ('-full' === modifier) ?
        // tidy-[span|offset]-full()
        acc.replace(match, full) :
        // tidy-[span|offset] ()
        acc.replace(match, fluid);

      // Remove any nested calc() function.
      // return stripExtraCalc(acc);
      return acc;
    }, declaration.value);

    // Replace declaration(s) with cloned and updated declarations.
    declaration.replaceWith(cleanClone(
      declaration,
      {
        prop: declaration.prop,
        value: replaceWithValue,
      },
    ));
  }
}

module.exports = {
  tidyFunction,
  FUNCTION_REGEX,
};
