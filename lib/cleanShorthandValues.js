/**
 * Clean and trim shorthand property values.
 * Remove slashes, spaces, and invalid/unneeded values.
 *
 * @param {Object} values An object of matched shorthand property values.
 *
 * @return {Object}
 */
function cleanShorthandValues(values) {
  const properties = Object.keys(values)
    .reduce((acc, key) => {
      const value = values[key];

      if (undefined !== value) {
        const cleanValue = value.replace(/\/|span/g, '').trim();

        // Zero and `none` values are skipped.
        if (0 !== Number(cleanValue, 10) && 'none' !== cleanValue) {
          acc[key] = cleanValue;
        }
      }

      return acc;
    }, {});

  return properties;
}

module.exports = cleanShorthandValues;
