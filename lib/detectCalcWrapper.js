/* eslint-disable max-len */

const tidyPattern = 'tidy-(span|offset)(-full)?';
const newCalcPattern = `\\d+\\w+|[+*-/]|${tidyPattern}\\(\\d+\\)|(?<!${tidyPattern})\\([^)(]*\\)`;
// /\d+\w+|[+*-/]|tidy-(span|offset)(-full)?\(\d+\)|(?<!tidy-(span|offset)(-full)?)\([^)(]*\)/g;
const NEW_CALC_REGEX = new RegExp(newCalcPattern, 'g');

function detectCalcWrapper(input) {
  // const NEW_CALC_REGEX = new RegExp(tidyPattern, 'g');
  // const globalRegExp = new RegExp(FUNCTION_REGEX);
  const tidyRegExp = new RegExp(`${tidyPattern}\\(([\\d.-]+)\\)`);

  /**
   * Detect a tidy-span|offset function nested within a CSS calc() function.
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
  if (/calc/.test(input)) {
    const calcMatches = input
      .split('calc')
      .map(str => str.match(NEW_CALC_REGEX))
      .filter((match) => {
        if (null !== match) {
          const str = match.join(' ');
          return tidyRegExp.test(str);
        }

        return false;
      })
      .reduce((acc, pieces) => {
        const whole = pieces.join(' ');
        const [match] = whole.match(tidyRegExp);
        const newRegex = new RegExp(`calc\\(${whole.replace(/([)(+-/*]+)/g, '\\$1')}\\)`);
        const isNested = newRegex.test(input);
        return [...acc, { match, isNested }];
      }, []);

    return calcMatches;
  }

  const matches = input.match(new RegExp(tidyRegExp, 'g'));
  if (matches) {
    return matches.reduce((acc, match) => ([...acc, { match, isNested: false }]), []);
  }

  return [];
}

module.exports = {
  detectCalcWrapper,
  NEW_CALC_REGEX,
};
