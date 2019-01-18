/* eslint-disable no-param-reassign */
const cleanClone = require('./cleanClone');

/**
 * Replace `tidy-[span|offset]()` and `tidy-[span|offset]-full()` functions.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#span-function
 * @see https://github.com/goodguyry/postcss-tidy-columns#offset-function
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} Tidy        An instance of the Tidy class.
 */
module.exports = function tidyFunction(declaration, tidy) {
  const FUNCTION_REGEX = /tidy-(span|offset)(|-full)\(([\d.-]+)\)/;
  const globalRegExp = new RegExp(FUNCTION_REGEX, 'g');
  const localRegExp = new RegExp(FUNCTION_REGEX);

  if (localRegExp.test(declaration.value)) {
    const { grid } = tidy;
    const fullMatch = declaration.value.match(globalRegExp);

    /**
     * Find all matches in the declaration value.
     *
     * @param  {String} acc       The accumulator, based on declaration.value
     * @param  {String} tidyMatch The full tidy function match(es)
     *
     * @return {String}           The replacement value for the declaration
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
      let { fluid, full } = ('span' === slug) ?
        grid.spanCalc(value) :
        grid.offsetCalc(value);

      /**
       * If the tidy- function is nested in a calc() function, remove 'calc'
       * from the  span/offset values.
       */
      if (/^calc\(.*\)$/.test(declaration.value)) {
        [fluid, full] = [fluid, full].map(calc => (
          (undefined !== calc) ? calc.replace('calc', '') : calc));
      }

      return ('-full' === modifier) ?
        // tidy-[span|offset]-full()
        acc.replace(match, full) :
        // tidy-[span|offset] ()
        acc.replace(match, fluid);
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
};
