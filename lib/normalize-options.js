const varPattern = /var\((--[\w-]+)\)/;

/**
 * Normalize option value types.
 * Since CSS values are always strings, we need to do some type checking.
 *
 * @param {Object} options The options object.
 *
 * @returns {Object}
 */
function normalizeOptions(options) {
  const LENGTH_REGEX = /^[0-9.]+(px|r?em)?$/;

  const validateOptions = Object.keys(options)
    .reduce((acc, key) => {
      const option = options[key];

      if (varPattern.test(option)) {
        // Use the raw option value if it's a var() function.
        acc[key] = option;
      } else {
        // `columns` should be a number.
        if ('columns' === key && !Number.isNaN(Number(option))) {
          acc[key] = Number(option);
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'siteMax'].includes(key) && LENGTH_REGEX.test(option)) {
          // Force `undefined` in place of `0`.
          const fallback = 0 === Number(option) ? 0 : undefined;
          acc[key] = (/(px|r?em)$/.test(option)) ? option : fallback;
        }
      }

      return acc;
    }, {});

  return validateOptions;
}

module.exports = {
  normalizeOptions,
  varPattern,
};
