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

/**
 * Sort an array of objects by an object property.
 *
 * @param  {Array}  objs     An array of objects.
 * @param  {String} property The property name to sort the objects by.
 *
 * @return {Array}
 */
function sortObjectsByProperty(objs, property) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return objs.sort((a, b) => collator.compare(undefined, a[property], b[property]));
}

module.exports = {
  sortStrings,
  sortObjectsByProperty,
};
