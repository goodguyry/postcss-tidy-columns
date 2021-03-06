/**
 * Camelcase the hyphenated property names.
 *
 * @param {string} property        A property name to camelcase.
 * @param {string} [delimiter='-'] A custom delimiter by which to split the string.
 */
function camelCaseProperty(property, delimiter = '-') {
  const pieces = property.split(delimiter).map((word, i) => (
    (i !== 0) ? word.charAt(0).toUpperCase() + word.slice(1) : word
  ));

  return pieces.join('');
}

module.exports = camelCaseProperty;
