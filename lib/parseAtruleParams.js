/**
 * Matches min-width and max-width media query parameters.
 *
 * @type {RegExp}
 */
const WIDTH_REGEX = /\((min|max)-width: ([\d.]+(r?em|px))\)/;

/**
 * Parse AtRule params.
 *
 * @param {String} params The atrule params.
 *
 * @return {Array} And array of [range, width] arrays.
 */
function parseAtruleParams(params) {
  const andSplit = params.split('and');

  return andSplit.reduce((acc, section) => {
    if (WIDTH_REGEX.test(section) && 'screen' !== section.trim()) {
      const [, minMax, value] = section.match(WIDTH_REGEX);
      return [...acc, { minMax, value }];
    }

    return acc;
  }, []);
}

module.exports = {
  parseAtruleParams,
  WIDTH_REGEX,
};
