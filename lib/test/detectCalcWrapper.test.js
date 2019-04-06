/* eslint-disable max-len */
// const FUNCTION_REGEX = require('../../tidy-function');
const { detectCalcWrapper, NEW_CALC_REGEX } = require('../detectCalcWrapper');

describe('Remove nested calc() function resulting from the tidy-* function replacement', () => {
  /**
   * Test strings for new helper
   */
  // test.each([
  //   'calc(20px + tidy-span(3) + 60px)',
  //   'calc((20px + 100) + tidy-offset-full(3) + (60px - 1))',
  //   'calc(20px + tidy-span(3))',
  //   'calc((20px + 300) + tidy-offset(3))',
  //   'calc(20px + tidy-span-full(3) + (60px - 1))',
  //   'calc((20px + 100) + tidy-span(3) + 60px)',
  //   'calc(tidy-span(3) + 20px)',
  //   'calc(tidy-offset-full(3) + (20px * 6))',
  //   '0 calc((20px + 100) + tidy-offset(3) + (60px - 1)) 0 calc(400 + 3)',
  //   '0 calc((20px + 100) + tidy-offset-full(3) + (60px - 1)) 0 calc(tidy-offset(6) + 3px)',
  //   '0 calc((20px + 100) + tidy-span-full(3) + (60px - 1)) 0 calc(tidy-offset-full(5) + (3px * 2))',
  //   '0 calc((20px + 100) + tidy-offset-full(3) + (60px - 1)) 0 calc(100px + tidy-span-full(4) + (3px * 2))',
  // ])(
  //   'Matches %s',
  //   (input) => {
  //     const NEW_CALC_REGEX = /\d+\w+|[+*-/]|(tidy-(span|offset)(-full)?\(\d+\))|(?<!tidy-(span|offset)(-full)?)\([^)(]*\)/g;
  //     expect(NEW_CALC_REGEX.test(input)).toBeTruthy();
  //     // expect(input.match(NEW_CALC_REGEX)).toEqual('');
  //   },
  // );

  test.each([
    [
      'calc(20px + tidy-span(3) + 60px)',
      [
        {
          match: 'tidy-span(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc((20px + 100) + tidy-offset-full(3) + (60px - 1))',
      [
        {
          match: 'tidy-offset-full(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc(20px + tidy-span(3))',
      [
        {
          match: 'tidy-span(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc((20px + 300) + tidy-offset(3))',
      [
        {
          match: 'tidy-offset(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc(20px + tidy-span-full(3) + (60px - 1))',
      [
        {
          match: 'tidy-span-full(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc((20px + 100) + tidy-span(3) + 60px)',
      [
        {
          match: 'tidy-span(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc(tidy-span(3) + 20px)',
      [
        {
          match: 'tidy-span(3)',
          isNested: true,
        },
      ],
    ],
    [
      'calc(tidy-offset-full(3) + (20px * 6))',
      [
        {
          match: 'tidy-offset-full(3)',
          isNested: true,
        },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-offset(3) + (60px - 1)) 0 calc(400 + 3)',
      [
        {
          match: 'tidy-offset(3)',
          isNested: true,
        },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-offset-full(3) + (60px - 1)) 0 calc(tidy-offset(6) + 3px)',
      [
        {
          match: 'tidy-offset-full(3)',
          isNested: true,
        },
        {
          match: 'tidy-offset(6)',
          isNested: true,
        },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-span-full(3) + (60px - 1)) 0 calc(tidy-offset-full(5) + (3px * 2))',
      [
        {
          match: 'tidy-span-full(3)',
          isNested: true,
        },
        {
          match: 'tidy-offset-full(5)',
          isNested: true,
        },
      ],
    ],
    [
      '0 calc((20px + 100) + tidy-offset-full(3) + (60px - 1)) 0 calc(100px + tidy-span-full(4) + (3px * 2))',
      [
        {
          match: 'tidy-offset-full(3)',
          isNested: true,
        },
        {
          match: 'tidy-span-full(4)',
          isNested: true,
        },
      ],
    ],
    [
      // No tidy-* functions.
      '0 calc((20px + 100) + (60px - 1)) 0 calc(100px + (3px * 2))',
      [],
    ],
    [
      // No calc() function.
      '0 tidy-span(3) 0 tidy-offset-full(9)',
      [
        {
          match: 'tidy-span(3)',
          isNested: false,
        },
        {
          match: 'tidy-offset-full(9)',
          isNested: false,
        },
      ],
    ],
  ])(
    'Finds %s',
    (input, expected) => {
      // const tidyPattern = 'tidy-(span|offset)(-full)?';
      // const newCalcPattern = `\\d+\\w+|[+*-/]|${tidyPattern}\\(\\d+\\)|(?<!${tidyPattern})\\([^)(]*\\)`;
      // const NEW_CALC_REGEX = new RegExp(newCalcPattern, 'g');
      expect(NEW_CALC_REGEX.test(input)).toBeTruthy();
      expect(detectCalcWrapper(input)).toEqual(expected);
    },
  );
});
