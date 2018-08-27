const varPattern = /^var\(--[\w-]+\)/;

/**
 * Normalize option value types.
 * Since CSS values are always strings, we need to do some type checking.
 *
 * @param {Object} options The options object.
 *
 * @returns {Object}
 */
function normalizeOptions(options) {
  const LENGTH_REGEX = /^[0-9.]+(px|r?em)+$/;

  const validateOptions = Object.keys(options)
    .reduce((acc, key) => {
      const option = options[key];

      // These will be filtered out later.
      if ('inherit' === option || undefined === option) {
        return acc;
      }

      if (varPattern.test(option)) {
        // Use the raw option value if it's a var() function.
        acc[key] = option;
      } else {
        // `columns` should be a number.
        if ('columns' === key && !Number.isNaN(Number(option))) {
          acc[key] = Number(option);
        }

        // `addGap` should be Boolean.
        if ('addGap' === key) {
          acc[key] = ('true' === String(option));
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'siteMax'].includes(key) && LENGTH_REGEX.test(option)) {
          // Force `undefined` in place of `0`.
          acc[key] = 0 === Number(option) ? undefined : option;
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
