const { sortOptions } = require('./sort');

/**
 * Compare numerical strings.
 *
 * Compare returns:
 * - Negative number if the reference string occurs before the compare string.
 * - Positive if the reference string occurs after the compare string.
 * - 0 if they are equivalent
 *
 * @param {String} reference The reference string.
 * @param {String} compare   The compare string.
 *
 * @return {Number}
 */
module.exports = function compareStrings(reference, compare) {
  return reference.localeCompare(compare, undefined, sortOptions);
};
