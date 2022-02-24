/* eslint-disable max-len */
const detectCalcWrapper = require('../detectCalcWrapper');

/**
 * Extract tidy-span|offset functions and note whether it is nested within a CSS calc() function.
 */
describe('Extract tidy-span|offset functions and note whether it is nested within a CSS calc() function', () => {
  test.each([
    [
      'calc(20px + tidy-span(3) + 60px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 100) + tidy-offset(3) + (60px - 1))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      'calc(20px + tidy-span(3))',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 300) + tidy-offset(3))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      'calc(20px + tidy-span(3) + (60px - 1))',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc((20px + 100) + tidy-span(3) + 60px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc(tidy-span(3) + 20px)',
      [{ match: 'tidy-span(3)', isNested: true }],
    ],
    [
      'calc(tidy-offset(3) + (20px * 6))',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      '0 calc((20px + (100)) + (tidy-offset(3) + (60px - 1))) 0 calc(400 + 3)',
      [{ match: 'tidy-offset(3)', isNested: true }],
    ],
    [
      '0 calc(((((20px + 100) / 14) * 3) + tidy-offset(3)) + (60px - 1)) 0 calc(tidy-offset(6) + 3px)',
      [
        { match: 'tidy-offset(3)', isNested: true },
        { match: 'tidy-offset(6)', isNested: true },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-span(3) + (60px - 1)) 0 calc(tidy-offset(5) + (3px * 2))',
      [
        { match: 'tidy-span(3)', isNested: true },
        { match: 'tidy-offset(5)', isNested: true },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-offset(3) + (60px - 1)) 0 calc(100px + tidy-span(4) + (3px * 2))',
      [
        { match: 'tidy-offset(3)', isNested: true },
        { match: 'tidy-span(4)', isNested: true },
      ],
    ],
    [
      '0 tidy-offset(3) 0 calc(100px + tidy-span(4) + (3px * 2))',
      [
        { match: 'tidy-offset(3)', isNested: false },
        { match: 'tidy-span(4)', isNested: true },
      ],
    ],
    [
      // No calc() function.
      '0 tidy-span(3) 0 tidy-offset(9)',
      [
        {
          match: 'tidy-span(3)',
          isNested: false,
        },
        {
          match: 'tidy-offset(9)',
          isNested: false,
        },
      ],
    ],
    [
      // No calc() function.
      '0 calc(100% - 20px) 0 tidy-offset(9)',
      [
        {
          match: 'tidy-offset(9)',
          isNested: false,
        },
      ],
    ],
  ])(
    'Detects %s',
    (input, expected) => {
      expect(detectCalcWrapper(input)).toEqual(expected);
    },
  );

  test.each([
    '0 calc((20px + 100) + (60px - 1)) 0 calc(100px + (3px * 2))',
    'calc(100% - (3rem + 4rem) * 12)',
    '0 100px 50px 100px',
    "url('bg-img.jpg') no-repeat",
  ])(
    'Skips %s',
    (input) => {
      expect(detectCalcWrapper(input)).toEqual([]);
    },
  );
});
