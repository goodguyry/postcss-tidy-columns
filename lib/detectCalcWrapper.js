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
function detectCalcWrapper(declaration) {
  const FUNCTION_REGEX = /tidy-(span|offset)(-full)?\(([\d.-]+)\)/g;

  if (/calc/.test(declaration)) {
    // Split the declaration at the calc function(s).
    const calcSplit = declaration.split('calc');

    const calcResults = calcSplit
      // Ensure there is a calc() function within the string.
      .filter(split => split.match(FUNCTION_REGEX) && '' !== split)
      // Extract the string within balanced parentheses.
      .reduce((acc, piece) => {
        let balanced = false;
        let openingCount = 0;
        let closingCount = 0;

        let result = '';
        const results = [];

        [...piece].forEach((character) => {
          // Add the current character to the accumulator.
          result += character;

          // true evaluates to 1; false to 0;
          openingCount += Number('(' === character);
          closingCount += Number(')' === character);

          // Non-zero opening and closing values that equal each other.
          balanced = (0 !== openingCount + closingCount) && openingCount === closingCount;

          if (balanced) {
            let isNested = false;

            // Only work on strings containing a tidy-* function.
            if (FUNCTION_REGEX.test(result)) {
              // Detect whether the balanced result is within a calc() function.
              const newRegex = new RegExp(`calc${result.replace(/([)(+-/*])/g, '\\$1')}`);
              isNested = newRegex.test(declaration);

              // Extract the tidy-* function and detect whether it's inside a calc() function.
              const [match] = piece.match(FUNCTION_REGEX);
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

        // One last check to make sure there's a tidy-* function within the string.
        return [...acc, ...results];
      }, []);

    return calcResults;
  }

  // Extract any tidy-* functions and note they are not nested.
  const matches = declaration.match(FUNCTION_REGEX) || [];
  return matches
    // Filter out any falsy values.
    .filter(match => match)
    .map(match => ({ match, isNested: false }));
}

module.exports = detectCalcWrapper;
