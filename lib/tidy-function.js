/* eslint-disable no-param-reassign */

const postcss = require('postcss');

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

  if (FUNCTION_REGEX.test(declaration.value)) {
    const { grid } = tidy;
    /**
     * match:    The full function expression.
     * slug:     One of either `span` or `offset`.
     * modifier: One of either `undefined` or `-full`.
     * value:    The function's argument.
     */
    const [match, slug, modifier, value] = declaration.value.match(FUNCTION_REGEX);

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
      fluid = fluid.replace('calc', '');
      full = full.replace('calc', '');
    }

    if ('-full' === modifier) {
      // tidy-[span|offset]-full()
      declaration
        .cloneBefore()
        .replaceWith(postcss.decl({
          prop: declaration.prop,
          value: declaration.value.replace(match, full),
        }));
    } else {
      // tidy-[span|offset] ()
      declaration
        .cloneBefore()
        .replaceWith(postcss.decl({
          prop: declaration.prop,
          value: declaration.value.replace(match, fluid),
        }));
    }

    declaration.remove();
  }
};
