/**
 * Round the given number to the specified number of decimal places.
 *
 * @param {Number} toRound       The number to round.
 * @param {Number} decimalPlaces The number of decimal places to round `toRound` to.
 *
 * @return {Number}
 */
module.exports = function roundToPrecision(toRound, decimalPlaces = 4) {
  const precision = (10 ** decimalPlaces);
  return (0 === toRound) ? 0 : Math.round(toRound * precision) / precision;
};
