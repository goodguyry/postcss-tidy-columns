const { sortStrings, sortObjectsByProperty } = require('./utils/sort');
const valuesHaveSameUnits = require('./utils/valuesHaveSameUnits');

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
          let collectedValues = [];

          const breakpoints = option.reduce((bpAcc, opts) => {
            // Only act if the Object has a `breakpoint` property.
            if (Object.prototype.hasOwnProperty.call(opts, 'breakpoint')) {
              const bpOpts = normalizeOptions(opts);
              // Add the `breakpoint` value to the collected values array.
              collectedValues = [...collectedValues, bpOpts.breakpoint];
              return [...bpAcc, bpOpts];
            }

            return bpAcc;
          }, [])
            // Sort the breakpoints array before beginning.
            .sort((a, b) => a.breakpoint
              .localeCompare(b.breakpoint, undefined, { numeric: true, sensitivity: 'base' }))
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
          acc[key] = sortObjectsByProperty(breakpoints, 'breakpoint');

          // Save collected breakpoint values if present and all the same units.
          if (valuesHaveSameUnits(collectedValues)) {
            acc.collectedBreakpointValues = sortStrings(collectedValues);
          }
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
