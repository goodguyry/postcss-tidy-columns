const { isEmpty, isCustomProperty } = require('../lib/values');

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 *
 * @type {RegExp}
 */
const LENGTH_REGEX = /[0-9.]+(px|r?em)+$/;

/**
 * Normalize option value types.
 * Since CSS values are always strings, we need to do some type checking.
 *
 * @param  {Object} options The options object.
 * @return {Object}
 */
const normalizeOptions = (options) => {
  const validateOptions = Object.keys(options)
    .reduce((acc, key) => {
      const option = options[key];

      // Short circuit if the value is falsy.
      if (isEmpty(option)) {
        acc[key] = undefined;
        return acc;
      }

      if (isCustomProperty(option)) {
        // Use the raw option value if it's a var() function.
        acc[key] = option;
      } else {
        // `columns` should be a number.
        if ('columns' === key && !Number.isNaN(Number(option))) {
          acc.columns = Number(option);
        }

        // Base should be 'vw' or '%'.
        if ('base' === key && ['vw', '%'].includes(option)) {
          acc.base = ('%' === option) ? option : 'vw';
        }

        // `debug` and `reduce` should be a Boolean value.
        if (['debug', 'reduce'].includes(key) && 'true' === String(option)) {
          acc[key] = true;
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'max'].includes(key) && LENGTH_REGEX.test(option)) {
          acc[key] = option;
        }
      }

      return acc;
    }, {});

  return validateOptions;
};

module.exports = {
  normalizeOptions,
  LENGTH_REGEX,
};
