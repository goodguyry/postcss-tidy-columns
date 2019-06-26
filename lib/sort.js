/**
 * Shared sort options.
 *
 * @type {Object}
 */
const sortOptions = { numeric: true, sensitivity: 'base' };

/**
 * Sort array of strings.
 *
 * @return {Array|Boolean} Sorted array if all values have same units; false if not.
 */
function strings() {
  const collator = new Intl.Collator(undefined, sortOptions);
  return collator.compare;
}

module.exports = {
  strings,
  sortOptions,
};
