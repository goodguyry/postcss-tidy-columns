/**
 * Check array values for like units.
 *
 * @param {Array} values An array of values to check.
 *
 * @return {Boolean}
 */
function valuesHaveSameUnits(values) {
  const collectedUnits = values.reduce((acc, value) => {
    const [, units] = value.match(/^[.\d]+(px|r?em)$/);
    return [...acc, units];
  }, []);

  return (1 === new Set(collectedUnits).size);
}

module.exports = valuesHaveSameUnits;
