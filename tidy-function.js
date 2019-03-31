/* eslint-disable no-param-reassign */
const cleanClone = require('./lib/cleanClone');
const { stripExtraCalc } = require('./lib/stripExtraCalc');

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
  const globalRegExp = new RegExp(FUNCTION_REGEX, 'g');
  const localRegExp = new RegExp(FUNCTION_REGEX);

  if (localRegExp.test(declaration.value)) {
    const { columns } = tidy;
    const fullMatch = declaration.value.match(globalRegExp);

    /**
     * Find all matches in the declaration value.
     *
     * @param {String} acc       The accumulator, based on declaration.value
     * @param {String} tidyMatch The full tidy function match(es).
     *
     * @return {String}          The replacement value for the declaration.
     */
    const replaceWithValue = fullMatch.reduce((acc, tidyMatch) => {
      /**
       * match:    The full function expression.
       * slug:     One of either `span` or `offset`.
       * modifier: One of either `undefined` or `-full`.
       * value:    The function's argument.
       */
      const [match, slug, modifier, value] = tidyMatch.match(localRegExp);

      /**
       * Get the span or offset `calc()` value(s).
       *
       * fluid: calc() function based on 100vw base.
       * full:  calc() function based on `siteMax` base.
       */
      const { fluid, full } = ('span' === slug) ?
        columns.spanCalc(value) :
        columns.offsetCalc(value);

      acc = ('-full' === modifier) ?
        // tidy-[span|offset]-full()
        acc.replace(match, full) :
        // tidy-[span|offset] ()
        acc.replace(match, fluid);

      // Remove any nested calc() function.
      return stripExtraCalc(acc);
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