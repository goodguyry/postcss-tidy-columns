/**
 * Separate a CSS length value's number from its units.
 *
 * @param {String} value A CSS length value.
 *
 * @return {Array}
 */
module.exports = function splitCssUnit(value) {
  return ('string' === typeof value)
    ? [parseFloat(value), value.replace(/[\d.]/g, '')]
    : [value, undefined];
};
