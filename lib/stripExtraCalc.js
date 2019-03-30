
/**
 * Remove nested calc() function resulting from the tidy-* function replacement.
 *
 * @param  {String} value The value to be tested.
 * @return {String}
 */
function stripExtraCalc(value) {
  const NESTED_CALC_REGEX = /(calc[(\s]+)(calc\()/;
  return (NESTED_CALC_REGEX.test(value)) ? value.replace(NESTED_CALC_REGEX, '$1(') : value;
}

module.exports = stripExtraCalc;
