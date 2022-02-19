const { isCustomProperty } = require('../lib/isCustomProperty');
const { strings } = require('../lib/sort');
const valuesHaveSameUnits = require('../lib/valuesHaveSameUnits');

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 *
 * @type {RegExp}
 */
const LENGTH_REGEX = /^[0]$|[0-9.]+(px|r?em)+$/;

/**
 * Nomalize, collect and merge breakpoint configs.
 *
 * @param {Object} bpConfigs A breakpoints config object.
 * @param {Array}  acc       The `validateOptions.reduce` accumulator.
 */
function handleBreakpointConfigs(bpConfigs, acc) {
  // Normalize breakpoint configs.
  const normalizedConfigs = Object.keys(bpConfigs)
    // Sort the breakpoints array before beginning.
    .sort(strings())
    // Reverse the array to work from largest breakpoint to smallest.
    .reverse()
    .reduce((bpAcc, oldKey) => {
      // Assume `px` for unitless breakpoint value.
      const newKey = /^[\d.]+$/.test(oldKey) ? `${oldKey}px` : oldKey;

      // Assign the original value to the new key.
      return { ...bpAcc, [newKey]: normalizeOptions(bpConfigs[oldKey]) }; // eslint-disable-line no-use-before-define
    }, {});

  // Return early if breakpoint values aren't all the same units.
  if (!valuesHaveSameUnits(Object.keys(normalizedConfigs))) {
    return acc;
  }

  // Merge breakpoint configs.
  const mergedConfigs = Object.keys(normalizedConfigs)
    .reduce((mergeAcc, config, index) => {
      // Get the next config, if any.
      const lookAhead = Object.keys(normalizedConfigs)[index + 1];
      const nextConfig = Object.assign({}, normalizedConfigs[lookAhead]);

      // Merge each config's smaller sibling into it to mimic the cascade.
      const merged = Object.assign({}, normalizedConfigs[config], nextConfig);

      return { ...mergeAcc, [config]: { ...merged } };
    }, {});


  // Re-sort the breakpoints object.
  const breakpoints = Object.keys(mergedConfigs)
    .sort(strings())
    // Piece the object back together.
    .reduce((testAcc, item) => ({ ...testAcc, [item]: mergedConfigs[item] }), {});

  return { ...acc, breakpoints };
}

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
        if (['gap', 'edge', 'siteMax'].includes(key) && LENGTH_REGEX.test(option)) {
          // Force `undefined` in place of unitless non-zero value.
          const fallback = 0 === Number(option) ? 0 : undefined;
          acc[key] = (/(px|r?em)$/.test(option)) ? option : fallback;
        }

        // Nomalize, collect, and merge breakpoint configs.
        if ('breakpoints' === key) {
          const breakpoints = handleBreakpointConfigs(option, acc);
          return Object.assign({}, acc, breakpoints);
        }
      }

      return acc;
    }, {});

  return validateOptions;
}

module.exports = {
  normalizeOptions,
  handleBreakpointConfigs,
  LENGTH_REGEX,
};
