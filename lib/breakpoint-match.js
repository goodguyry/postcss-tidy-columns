const parseAtRuleParams = require('../lib/utils/parseAtRuleParams');
const compareStrings = require('../lib/utils/compareStrings');

/**
 * Check if an atrule.param is within a range of breakpoints.
 *
 * @param  {String} params      The atrule params.
 * @param  {Object} options     The options object.
 * @param  {Array} breakpoints  The array of breakpoint option values.
 *
 * @returns {Object}            The matching options breakpoint object, or undefined.
 */
module.exports = function breakpointMatch(params, options, breakpoints) {
  // TODO: Convert between units if they don't match (options.breakpoints[i].base)
  const parsedParams = parseAtRuleParams(params);
  const matchingBp = parsedParams.map((param) => {
    const { minMax, value } = param;

    // If the breakpoints array contains the value, just return it.
    if (breakpoints.includes(value)) {
      return options.breakpoints.find(obj => obj.breakpoint == value);
    }

    // Reverse the breakpoints array for min value matching
    if ('min' === minMax) {
      breakpoints = breakpoints.reverse();
    }

    // Find the breakpoint that encompases the param value.
    const matchingBp = breakpoints.reduce((acc, bp) => (0 < compareStrings(value, bp)) ? bp : acc, '');

    // Return the options breakpoint object, or undefined ir not found.
    return options.breakpoints.find(obj => obj.breakpoint == matchingBp);
  });

  // TODO: Look into filtering this instead.
  if (1 !== matchingBp.length) {
    return (Object.is(matchingBp[0], matchingBp[1])) ? matchingBp.pop() : undefined;
  }

  return matchingBp.pop();
}
