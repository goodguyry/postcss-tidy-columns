/**
 * Returns true for values that contain an empty or otherwise useless value.
 *
 * @param  {Mixed} values The value to be checked.
 * @return {Boolean}      Whether the value is considered empty.
 */
exports.isEmpty = (value) => (
  [
    false,
    'false',
    null,
    undefined,
    0,
    '0',
  ].includes(value)
);

/**
 * Pattern to match CSS Custom Properties.
 *
 * @type {RegExp}
 */
const CUSTOM_PROP_REGEX = /var\(\s?(--[\w-]+)\s?[^)]*\)/;

/**
 * Returns true if the value is a CSS Custom Property.
 *
 * @param  {String} value A CSS property value.
 * @return {Boolean}
 */
exports.isCustomProperty = (value) => CUSTOM_PROP_REGEX.test(value);

/**
 * Round the given number to the specified number of decimal places.
 *
 * @param  {Number} toRound       The number to round.
 * @param  {Number} decimalPlaces The number of decimal places to round `toRound` to.
 * @return {Number}
 */
exports.roundToPrecision = (toRound, decimalPlaces = 4) => {
  const precision = (10 ** decimalPlaces);
  return (0 === toRound) ? 0 : Math.round(toRound * precision) / precision;
};

/**
 * Separate a CSS length value's number from its units.
 *
 * @todo Move this into Columns.js
 *
 * @param  {String} value A CSS length value.
 * @return {Array}
 */
exports.splitCssUnit = (value) => (
  ('string' === typeof value)
    ? [parseFloat(value), value.replace(/[\d.]/g, '')]
    : [value, undefined]
);
