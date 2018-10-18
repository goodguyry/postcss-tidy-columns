// TODO:
// Pull the breakpoints out of the options as an array of width values
// Sort the array:
// var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
// [1024, 768].sort(collator.compare);

/**
 * Parse AtRule params
 * @param  {String} params The atrule params.
 *
 * @return {Array}        And array of [range, width] arrays.
 */
function parseAtRuleParams(params) {
  const andSplit = params.split('and');
  const WIDTH_REGEX = /\((min|max)-width: ([\d\.]+(r?em|px))\)/;

  return andSplit.reduce((acc, section) => {
    if (WIDTH_REGEX.test(section) && 'screen' !== section.trim()) {
      const [, minMax, value ] = section.match(WIDTH_REGEX);
      return [...acc, {minMax, value}];
    }

    return acc;
  }, []);
}

/**
 * Compare numerical strings.
 * @param  {String} value The parsed atrule param.
 * @param  {String} bp    The breakpoint length value.
 *
 * @return {Number}       A number representing how the value compares.
 *                        A negative number if the `value` occurs before `bp`.
 *                        positive if the `value` occurs after `bp`.
 *                        0 if they are equivalent
 */
function compareBreakpoints(value, bp) {
  return value.localeCompare(bp, undefined, {numeric: true, sensitivity: 'base'});
}

/**
 * Check if an atrule.param is within a range of breakpoints
 * @param  {String} params      The atrule params.
 * @param  {Object} options     The options object.
 * @param  {Array} breakpoints  The array of breakpoint option values.
 *
 * @return {Object}             The matching options breakpoint object, or undefined.
 */
function matchMediaQuery(params, options, breakpoints) {
  // TODO: Convert between units if they don't match (options.breakpoints[i].base)
  // Determine mediaQuery units
  const [, range, value] = params.match(/\((min|max)-width: ([a-z0-9\.]+)\)/);
  const [paramValue, paramUnits] = value.match(/^[\.\d]+(px|r?em)$/);

  // TODO: For each parseAtRuleParams(params)
  // - test all of the below
  // - compare found objects with Object.is();
  // - return a perfect match or none at all
  // At this point multiple matches would be considered unsupported

  // Return false if it's not a min/max media query
  // TODO: Account for (min and max) params
  if (! ['min', 'max'].includes(range)) {
    return false;
  }

  // if the breakpoints array contains the value, just return it
  if (breakpoints.includes(paramValue)) {
    return options.breakpoints.find(obj => obj.breakpoint == value);
  }

  // Reverse the breakpoints array for min value matching
  if ('min' === range) {
    breakpoints = breakpoints.reverse();
  }

  // A negative number if the `value` occurs before `bp`
  // positive if the `value` occurs after `bp`
  // 0 if they are equivalent
  const matchingBp = breakpoints.reduce((acc, bp) => (0 < compareBreakpoints(value, bp)) ? bp : acc, '');

  // Return the options breakpoint object, or undefined ir not found.
  return options.breakpoints.find(obj => obj.breakpoint == matchingBp);
}

describe('Find a breakpoint match: px', () => {
  const options = {
    breakpoints: [
      {
        breakpoint: '768px',
        gap: '0.625rem',
      },
      {
        breakpoint: '1024px',
        gap: '1rem',
      },
      {
        breakpoint: '1440px',
        gap: '1.25rem',
      }
    ]
  };

  const breakpoints = [
    '768px',
    '1024px',
    '1440px',
  ];

  test('min-width: 900px', () => {
      expect(
        matchMediaQuery(
          '(min-width: 900px)',
          options,
          breakpoints
        )
      ).toEqual({
        breakpoint: '768px',
        gap: '0.625rem',
      });
    });

  test('min-width: 600px', () => {
      expect(
        matchMediaQuery(
          '(min-width: 600px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 600px', () => {
      expect(
        matchMediaQuery(
          '(max-width: 600px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 900px', () => {
      expect(
        matchMediaQuery(
          '(max-width: 900px)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '768px',
        gap: '0.625rem',
      });
    });

  test('max-width: 1439px', () => {
      expect(
        matchMediaQuery(
          '(max-width: 1439px)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '1024px',
        gap: '1rem',
      });
    });

  test('max-width: 767px', () => {
      expect(
        matchMediaQuery(
          '(max-width: 767px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 1023px', () => {
      expect(
        matchMediaQuery(
          '(max-width: 1023px)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '768px',
        gap: '0.625rem',
      });
    });
});

describe('Find a breakpoint match: rem', () => {
  const options = {
    breakpoints: [
      {
        breakpoint: '48rem',
        gap: '0.625rem',
      },
      {
        breakpoint: '64rem',
        gap: '1rem',
      },
      {
        breakpoint: '90rem',
        gap: '1.25rem',
      }
    ]
  };

  const breakpoints = [
    '48rem',
    '64rem',
    '90rem',
  ];

  test('min-width: 56.25rem', () => {
      expect(
        matchMediaQuery(
          '(min-width: 56.25rem)',
          options,
          breakpoints
        )
      ).toEqual({
        breakpoint: '48rem',
        gap: '0.625rem',
      });
    });

  test('min-width: 37.5rem', () => {
      expect(
        matchMediaQuery(
          '(min-width: 37.5rem)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 37.5rem', () => {
      expect(
        matchMediaQuery(
          '(max-width: 37.5rem)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 56.25rem', () => {
      expect(
        matchMediaQuery(
          '(max-width: 56.25rem)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '48rem',
        gap: '0.625rem',
      });
    });

  test('max-width: 89.9375rem', () => {
      expect(
        matchMediaQuery(
          '(max-width: 89.9375rem)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '64rem',
        gap: '1rem',
      });
    });

  test('max-width: 47.9375rem', () => {
      expect(
        matchMediaQuery(
          '(max-width: 47.9375rem)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('max-width: 63.9375rem', () => {
      expect(
        matchMediaQuery(
          '(max-width: 63.9375rem)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '48rem',
        gap: '0.625rem',
      });
    });
});

describe('Parse media queries', () => {
  test('min-width', () => {
      expect(
        parseAtRuleParams('(min-width: 100px)')
      ).toEqual([{minMax: 'min', value: '100px'}]);
    });

  test('max-width', () => {
      expect(
        parseAtRuleParams('(max-width: 200px)')
      ).toEqual([{minMax: 'max', value: '200px'}]);
    });

  test('min-width and max-width', () => {
      expect(
        parseAtRuleParams('(min-width: 100px) and (max-width: 200px)')
      ).toEqual([{minMax: 'min', value: '100px'}, {minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 200px)')
      ).toEqual([{minMax: 'min', value: '200px'}]);
    });

  test('screen and max-width', () => {
      expect(
        parseAtRuleParams('screen and (max-width: 200px)')
      ).toEqual([{minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width and max-width', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 100px) and (max-width: 200px)')
      ).toEqual([{minMax: 'min', value: '100px'}, {minMax: 'max', value: '200px'}]);
    });

  test('screen and min-width (rem) and max-width (em)', () => {
      expect(
        parseAtRuleParams('screen and (min-width: 10rem) and (max-width: 40em)')
      ).toEqual([{minMax: 'min', value: '10rem'}, {minMax: 'max', value: '40em'}]);
    });

  test('screen and print', () => {
      expect(
        parseAtRuleParams('screen and print')
      ).toEqual([]);
    });
});
