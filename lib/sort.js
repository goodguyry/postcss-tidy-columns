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

/**
 * Sort an array of objects by an object property.
 *
 * @param {Array}  objs     An array of objects.
 * @param {String} property The property name to sort the objects by.
 *
 * @return {Array}
 */
function objectsByProperty(property) {
  return (a, b) => a[property].localeCompare(b[property], undefined, sortOptions);
}

module.exports = {
  strings,
  objectsByProperty,
  sortOptions,
};
