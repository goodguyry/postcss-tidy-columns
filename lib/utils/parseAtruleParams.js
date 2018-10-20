/**
 * Parse AtRule params.
 *
 * @param  {String} params The atrule params.
 *
 * @returns {Array} And array of [range, width] arrays.
 */
module.exports = function parseAtruleParams(params) {
  const andSplit = params.split('and');
  const WIDTH_REGEX = /\((min|max)-width: ([\d.]+(r?em|px))\)/;

  return andSplit.reduce((acc, section) => {
    if (WIDTH_REGEX.test(section) && 'screen' !== section.trim()) {
      const [, minMax, value] = section.match(WIDTH_REGEX);
      return [...acc, { minMax, value }];
    }

    return acc;
  }, []);
};
