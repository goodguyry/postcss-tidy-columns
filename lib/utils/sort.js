/**
 * Sort array of strings.
 *
 * @param {Array} strings An array of string values.
 *
 * @returns {Array|Boolean} Sorted array if all values have same units; false if not.
 */
function sortStrings(strings) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return strings.sort(collator.compare);
}

function sortObjectsByProperty(objs, property) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return objs.sort((a, b) => collator.compare(undefined, a[property], b[property]));
}

module.exports = {
  sortStrings,
  sortObjectsByProperty,
};
