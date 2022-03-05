const cleanClone = require('./lib/cleanClone');

/**
 * Matches tidy-var() functions.
 *
 * @type {RegExp}
 */
const VAR_FUNCTION_REGEX = /tidy-var\(["']?(columns|edge|gap|max)["']?\)/i;

/**
 * Replaces `tidy-var()` functions within property values.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#var-function
 *
 * @param {Declaration} declaration The current CSS declaration.
 * @param {Tidy}        tidy        An instance of the Tidy class.
 * @param {Result}      result      Provides the result of the PostCSS transformations.
 */
function tidyVar(declaration, tidy, result) {
  const globalRegExp = new RegExp(VAR_FUNCTION_REGEX, 'g');
  const localRegExp = new RegExp(VAR_FUNCTION_REGEX);

  const { ruleOptions } = tidy;
  const fullMatch = declaration.value.match(globalRegExp);

  if (Array.isArray(fullMatch)) {
    /**
     * Find all matches in the declaration value.
     *
     * @param {String} acc      The accumulator, based on declaration.value
     * @param {String} varMatch The full tidy function match(es)
     *
     * @return {String}         The replacement value for the declaration
     */
    const replaceWithValue = fullMatch.reduce((acc, varMatch) => {
      /**
       * match: The full function expression.
       * value: The function's argument.
       */
      const [match, value] = varMatch.match(localRegExp);

      // Replace the tidy-var() function with the real option value.
      if (Object.keys(ruleOptions).includes(value)) {
        return acc.replace(match, ruleOptions[value]);
      }

      // There's no corresponding option value.
      return acc;
    }, declaration.value);

    if (ruleOptions.debug) {
      result.warn(`Debug: ${result.opts.from} => ${declaration.toString()}`, { node: declaration });
    }

    // Clone after so the new declaration can be walked again.
    // This avoids a situation where another Tidy property or function is within this declaration.
    declaration.cloneAfter(cleanClone(
      declaration,
      {
        prop: declaration.prop,
        value: replaceWithValue,
      },
    ));

    // Remove the original declaration.
    declaration.remove();
  }
}

module.exports = {
  tidyVar,
  VAR_FUNCTION_REGEX,
};
