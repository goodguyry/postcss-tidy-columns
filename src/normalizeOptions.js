const { isCustomProperty } = require('../lib/isCustomProperty');

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 *
 * @type {RegExp}
 */
const LENGTH_REGEX = /^[0]$|[0-9.]+(px|r?em)+$/;

/**
 * Normalize option value types.
 * Since CSS values are always strings, we need to do some type checking.
 *
 * @param {Object} options The options object.
 *
 * @return {Object}
 */
function normalizeOptions(options) {
  const validateOptions = Object.keys(options)
    .reduce((acc, key) => {
      const option = options[key];

      if (isCustomProperty(option)) {
        // Use the raw option value if it's a var() function.
        acc[key] = option;
      } else {
        // `columns` should be a number.
        if ('columns' === key && !Number.isNaN(Number(option))) {
          acc[key] = Number(option);
        }

        // `debug` and `reduce` should be a Boolean value.
        if (['debug', 'reduce'].includes(key) && ['true', 'false'].includes(String(option))) {
          acc[key] = ('true' === String(option));
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'max'].includes(key) && LENGTH_REGEX.test(option)) {
          // Force `undefined` in place of unitless non-zero value.
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
  LENGTH_REGEX,
};
