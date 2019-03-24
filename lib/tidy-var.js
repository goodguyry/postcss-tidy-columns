/* eslint-disable no-param-reassign */
const cleanClone = require('./utils/cleanClone');

/**
 * Replace `tidy-var()` functions within property values.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#var-function
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} Tidy        An instance of the Tidy class.
 */
module.exports = function tidyVar(declaration, tidy) {
  const FUNCTION_REGEX = /tidy-var\(["']?(edge|gap|siteMax)["']?\)/i;
  const globalRegExp = new RegExp(FUNCTION_REGEX, 'g');
  const localRegExp = new RegExp(FUNCTION_REGEX);

  if (localRegExp.test(declaration.value)) {
    const { grid } = tidy;
    const fullMatch = declaration.value.match(globalRegExp);

    /**
     * Find all matches in the declaration value.
     *
     * @param {String} acc      The accumulator, based on declaration.value
     * @param {String} varMatch The full tidy function match(es)
     *
     * @return {String}          The replacement value for the declaration
     */
    const replaceWithValue = fullMatch.reduce((acc, varMatch) => {
      /**
       * match: The full function expression.
       * value: The function's argument.
       */
      const [match, value] = varMatch.match(localRegExp);

      // Replace the tidy-var() function with the real option value.
      if (Object.keys(grid.options).includes(value)) {
        return acc.replace(match, grid.options[value]);
      }

      // There's no corresponding option value.
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
};
