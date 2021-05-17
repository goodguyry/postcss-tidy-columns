/**
 * Check for matching units.
 *
 * @param {Arguments} units Argument list of units to check.
 *
 * @return {String}
 */
module.exports = function haveSameUnits(...units) {
  const set = new Set(units);
  const { value } = set.values().next();

  return (1 === set.size && undefined !== value) ? value : false;
};
