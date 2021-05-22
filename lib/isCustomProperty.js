/**
 * Pattern to match CSS Custom Properties.
 *
 * @type {RegExp}
 */
const CUSTOM_PROP_REGEX = /var\(\s?(--[\w-]+)\s?[^)]*\)/;

/**
 * Returns true if the value is a CSS Custom Property.
 *
 * @param {String} value A CSS property value.
 *
 * @return {Boolean}
 */
function isCustomProperty(value) {
  return CUSTOM_PROP_REGEX.test(value);
}

module.exports = {
  CUSTOM_PROP_REGEX,
  isCustomProperty,
};
