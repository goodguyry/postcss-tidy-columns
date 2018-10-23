const { strings, objectsByProperty } = require('./utils/sort');
const valuesHaveSameUnits = require('./utils/valuesHaveSameUnits');

const varPattern = /var\((--[\w-]+)\)/;

/**
 * Nomalize, collect and merge breakpoint configs.
 *
 * @param {Array} configs An array of breakpoint configs.
 * @param {Array} acc     The `validateOptions.reduce` accumulator.
 */
function handleBreakpointConfigs(configs, acc) {
  const breakpoints = configs.reduce((bpAcc, opts) => {
    // Only act if the Object has a `breakpoint` property.
    if (Object.prototype.hasOwnProperty.call(opts, 'breakpoint')) {
      return [...bpAcc, normalizeOptions(opts)]; // eslint-disable-line no-use-before-define
    }

    return bpAcc;
  }, [])
    // Sort the breakpoints array before beginning.
    .sort(objectsByProperty('breakpoint'))
    // Reverse the array to work from largest breakpoint to smallest.
    .reverse()
    // Merge each config's smaller sibling into it to mimic the cascade.
    .map((config, index, array) => {
      // Close the sibling config.
      const nextConfig = Object.assign({}, array[index + 1]);
      // Remove the `breakpoint` property to avoid overwriting during merge.
      delete nextConfig.breakpoint;

      return Object.assign({}, config, nextConfig);
    });

  // Re-sort the breakpoints.
  acc.breakpoints = breakpoints.sort(objectsByProperty('breakpoint'));

  // Save collected breakpoint values if present and all the same units.
  // eslint-disable-next-line max-len
  const collectedValues = breakpoints.reduce((valAcc, config) => [...valAcc, config.breakpoint], []);
  if (valuesHaveSameUnits(collectedValues)) {
    acc.collectedBreakpointValues = collectedValues.sort(strings());
  }

  return acc;
}

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

        // `addGap` should be Boolean.
        if ('addGap' === key && undefined !== option) {
          acc[key] = ('true' === String(option));
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'siteMax'].includes(key) && LENGTH_REGEX.test(option)) {
          // Force `undefined` in place of `0`.
          const fallback = 0 === Number(option) ? 0 : undefined;
          acc[key] = (/(px|r?em)$/.test(option)) ? option : fallback;
        }

        // Assume `px` for unitless option value.
        if ('breakpoint' === key) {
          acc[key] = /^[\d.]+$/.test(option) ? `${option}px` : option;
        }

        // Nomalize, collect and merge breakpoint configs.
        if ('breakpoints' === key) {
          const { breakpoints, collectedBreakpointValues } = handleBreakpointConfigs(option, acc);
          return Object.assign({}, acc, { breakpoints, collectedBreakpointValues });
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
