/* eslint-disable max-len */

const tidyPattern = 'tidy-(span|offset)(-full)?';
const newCalcPattern = `\\d+\\w+|[+*-/]|${tidyPattern}\\(\\d+\\)|(?<!${tidyPattern})\\([^)(]*\\)`;
const NEW_CALC_REGEX = new RegExp(newCalcPattern, 'g');

/**
 * Extract tidy-span|offset functions and note whether it is nested within a CSS calc() function.
 *
 * @param {String} value The declaration value.
 *
 * @returns {Array} [
 *   @type {Object} {
 *     An object describing any tidy-* functions found.
 *
 *     @type {Boolean} isNested Whether or not the tidy-* function is nested with a CSS calc() function.
 *     @type {String}  match    The tidy-* function to replace.
 *   }
 * ]
 */
function detectCalcWrapper(value) {
  const tidyRegExp = new RegExp(`${tidyPattern}\\(([\\d.-]+)\\)`);

  if (/calc/.test(value)) {
    return value
      .split('calc')
      // Extract expressions wrapped in parentheses.
      .map(str => str.match(NEW_CALC_REGEX))
      // Filter out any matches that don't contain a tidy-* function.
      .filter((match) => {
        const str = (null !== match) ? match.join(' ') : '';
        return tidyRegExp.test(str);
      })
      // Piece the matches back together.
      .map(pieces => pieces.join(' '))
      // Extract the tidy-* function and detect whether it's inside a calc() function.
      .map((whole) => {
        const [match] = whole.match(tidyRegExp);

        const newRegex = new RegExp(`calc\\(${whole.replace(/([)(+-/*]+)/g, '\\$1')}\\)`);
        const isNested = newRegex.test(value);

        return { match, isNested };
      });
  }

  // Extract any tidy-* functions and note they are not nested.
  const matches = value.match(new RegExp(tidyRegExp, 'g')) || [];
  return matches.map(match => ({ match, isNested: false }));
}

module.exports = {
  detectCalcWrapper,
  NEW_CALC_REGEX,
};
