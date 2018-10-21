/**
 * Check array values for like units.
 *
 * @param {Array} values An array of values to check.
 *
 * @returns {Boolean}
 */
module.exports = function valuesHaveSameUnits(values) {
  const collectedUnits = values.reduce((acc, value) => {
    const [, units] = value.match(/^[.\d]+(px|r?em)$/);
    return [...acc, units];
  }, []);

  // TODO: Warn if !haveSameUnits
  return (1 === new Set(collectedUnits).size);
};
