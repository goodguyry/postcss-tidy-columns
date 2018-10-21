const parseAtruleParams = require('../lib/utils/parseAtruleParams');
const compareStrings = require('../lib/utils/compareStrings');
const getObjectByProperty = require('../lib/utils/getObjectByProperty');

/**
 * Check if an atrule.param is within a range of breakpoints.
 *
 * @param  {String} params  The atrule params.
 * @param  {Object} options The options object.
 *
 * @returns {Object} The matching options breakpoint object, or undefined.
 */
module.exports = function breakpointMatch(params, options) {
  // TODO: Convert between units if they don't match (options.breakpoints[i].base)
  let { collectedBreakpointValues } = options;
  const parsedParams = parseAtruleParams(params);

  if (undefined === collectedBreakpointValues) {
    return undefined;
  }

  const breakpointMatches = parsedParams.map((param) => {
    const { minMax, value } = param;

    // If the breakpoints array contains the value, just return it.
    if (collectedBreakpointValues.includes(value)) {
      return getObjectByProperty(options.breakpoints, value, 'breakpoint');
    }

    // Reverse the breakpoints array for min value matching
    if ('min' === minMax) {
      collectedBreakpointValues = collectedBreakpointValues.reverse();
    }

    // Find the breakpoint that encompases the param value.
    const matchingBp = collectedBreakpointValues.reduce((acc, bp) => {
      const compareResult = compareStrings(value, bp);
      return (0 < compareResult) ? bp : acc;
    }, '');

    // Return the options breakpoint object, or undefined ir not found.
    return getObjectByProperty(options.breakpoints, matchingBp, 'breakpoint');
  });

  const breakpointsSet = new Set(breakpointMatches);
  return (1 === breakpointsSet.size) ? breakpointsSet.values().next().value : undefined;
};
