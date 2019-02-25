const parseAtruleParams = require('../lib/utils/parseAtruleParams');
const compareStrings = require('../lib/utils/compareStrings');
const getObjectByProperty = require('../lib/utils/getObjectByProperty');

/**
 * Check if an atrule.param is within a range of breakpoints.
 * Values are not converted between units if they don't match.
 *
 * @param  {String} params  The atrule params.
 * @param  {Object} options The options object.
 *
 * @returns {Object} The matching options breakpoint object, or undefined.
 */
module.exports = function breakpointMatch(params, options) {
  const { collectedBreakpointValues } = options;

  if (undefined === collectedBreakpointValues) {
    return undefined;
  }

  // Copy the array, since we may reverse it.
  const breakpointValues = collectedBreakpointValues.slice();
  const parsedParams = parseAtruleParams(params);

  const breakpointMatches = parsedParams.map((param) => {
    const { minMax, value } = param;

    // If the breakpoints array contains the value, just return it.
    if (breakpointValues.includes(value)) {
      return getObjectByProperty(options.breakpoints, value, 'breakpoint');
    }

    // Reverse the breakpoints array for min value matching
    if ('min' === minMax) {
      breakpointValues.reverse();
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

  // No warning due to not knowing if there's a tidy-[property|function] in the rule.
  // Return `undefined` and the global options will be used instead.
  return (1 === breakpointsSet.size) ? breakpointsSet.values().next().value : undefined;
};