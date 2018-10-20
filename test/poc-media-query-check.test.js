// TODO: Pull the breakpoints out of the options as an array of width values

/**
 * Check array values for like units.
 *
 * @param {Array} values An array of values to check.
 *
 * @returns {Boolean}
 */
function valuesHaveSameUnits(values) {
  const units = values.reduce((acc, value) => {
    const [, units] =  value.match(/^[\.\d]+(px|r?em)$/);
    return [...acc, units];
  }, []);

  return (1 === new Set(units).size);
}


/**
 * Parse AtRule params.
 *
 * @param  {String} params The atrule params.
 *
 * @returns {Array}        And array of [range, width] arrays.
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
function compareBreakpoints(acc, bp, value) {
  const compare = value.localeCompare(bp, undefined, {numeric: true, sensitivity: 'base'});
  return (0 < compare) ? bp : acc
}

/**
 * Check if an atrule.param is within a range of breakpoints.
 *
 * @param  {String} params      The atrule params.
 * @param  {Object} options     The options object.
 * @param  {Array} breakpoints  The array of breakpoint option values.
 *
 * @returns {Object}            The matching options breakpoint object, or undefined.
 */
function matchMediaQuery(params, options, breakpoints) {
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
    const matchingBp = breakpoints.reduce((acc, bp) => compareBreakpoints(acc, bp, value), '');

    // Return the options breakpoint object, or undefined ir not found.
    return options.breakpoints.find(obj => obj.breakpoint == matchingBp);
  });

  // TODO: Look into filtering this instead.
  if (1 !== matchingBp.length) {
    return (Object.is(matchingBp[0], matchingBp[1])) ? matchingBp.pop() : undefined;
  }

  return matchingBp.pop();
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

  test('Between breakpoint configs (min)', () => {
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

  test('Between breakpoint configs (max)', () => {
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

  test('Below lowest breakpoint config (min)', () => {
      expect(
        matchMediaQuery(
          '(min-width: 600px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('Below lowest breakpoint config (max)', () => {
      expect(
        matchMediaQuery(
          '(max-width: 600px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('Up-to breakpoint config', () => {
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

  test('Up-to lowest breakpoint config', () => {
      expect(
        matchMediaQuery(
          '(max-width: 767px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
    });

  test('Between breakpoint configs (min-max)', () => {
      expect(
        matchMediaQuery(
          '(min-width: 768px) and (max-width: 1023px)',
          options,
          breakpoints,
        )
      ).toEqual({
        breakpoint: '768px',
        gap: '0.625rem',
      });
    });

  test('Spanning two breakpoint configs (min-max)', () => {
      expect(
        matchMediaQuery(
          '(min-width: 768px) and (max-width: 1439px)',
          options,
          breakpoints,
        )
      ).toEqual(undefined);
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

describe('Sort breakpoints array', () => {
  test('Same units', () => {
      expect(
        sortBreakpoints(['1000px', '600px', '400px'])
      ).toEqual(['400px', '600px', '1000px']);
    });

  test('Different units', () => {
      expect(
        sortBreakpoints(['1000px', '60rem', '400px'])
      ).toEqual(false);
    });
});

describe('Values have same units', () => {
  test('Same units', () => {
      expect(
        valuesHaveSameUnits(['1000px', '600px', '400px'])
      ).toEqual(true);
    });

  test('Different units', () => {
      expect(
        valuesHaveSameUnits(['1000px', '60rem', '400px'])
      ).toEqual(false);
    });
});

