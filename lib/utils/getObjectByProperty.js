/**
 * Find an object based on a given property value.
 *
 * @param {Array}  haystack An array of objects.
 * @param {String} needle   The property value to match against.
 * @param {String} property The lookup property.
 *
 * @return {Object}
 */
function getObjectByProperty(haystack, needle, property) {
  return haystack.find(obj => needle === obj[property]);
}

module.exports = getObjectByProperty;
