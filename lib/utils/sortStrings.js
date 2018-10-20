const valuesHaveSameUnits = require('./valuesHaveSameUnits');

/**
 * Sort array of strings.
 *
 * @param {Array} strings An array of string values.
 *
 * @returns {Array|Boolean} Sorted array if all values have same units; false if not.
 */
module.exports = function sortStrings(strings) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const haveSameUnits = valuesHaveSameUnits(strings);

  // TODO: Warn if !haveSameUnits
  return (haveSameUnits) ? strings.sort(collator.compare) : false;
};
