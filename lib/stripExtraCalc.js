/**
 * Matches nested calc() functions.
 *
 * @type {RegExp}
 */
const NESTED_CALC_REGEX = /(calc[(\s\w+\-*/%.)]+)(calc\()/;

/**
 * Remove nested calc() function resulting from the tidy-* function replacement.
 *
 * @param  {String} value The value to be tested.
 * @return {String}
 */
function stripExtraCalc(value) {
  return (NESTED_CALC_REGEX.test(value)) ? value.replace(NESTED_CALC_REGEX, '$1(') : value;
}

module.exports = {
  stripExtraCalc,
  NESTED_CALC_REGEX,
};
