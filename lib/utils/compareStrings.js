/**
 * Compare numerical strings.
 *
 * Compare returns:
 * - Negative number if the `value` occurs before `bp`
 * - Positive if the `value` occurs after `bp`
 * - 0 if they are equivalent
 *
 * @param  {String} value The parsed atrule param.
 * @param  {String} bp    The breakpoint length value.
 *
 * @returns {String}
 */
module.exports = function compareStrings(acc, bp, value) {
  const compare = value.localeCompare(bp, undefined, {numeric: true, sensitivity: 'base'});
  return (0 < compare) ? bp : acc
}
