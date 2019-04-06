/* eslint-disable max-len */
const { stripExtraCalc, NESTED_CALC_REGEX } = require('../stripExtraCalc');

/**
 * Remove nested calc() function resulting from the tidy-* function replacement.
 */
describe('Remove nested calc() function resulting from the tidy-* function replacement', () => {
  test.skip.each([
    [
      'calc(calc(200 * 4) + 100)',
      'calc((200 * 4) + 100)',
    ],
    [
      'calc(100 + calc(200 * 4))',
      'calc(100 + (200 * 4))',
    ],
    [
      'calc(10.5% * ((400px / 2) * 1rem) - 60em + calc(100px / 3))',
      'calc(10.5% * ((400px / 2) * 1rem) - 60em + (100px / 3))',
    ],
    [
      'calc(20px + calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3))',
      'calc(20px + ((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3))',
    ],
  ])(
    'Matches and cleans: %s',
    (input, expected) => {
      expect(stripExtraCalc(input)).toEqual(expected);
      expect(NESTED_CALC_REGEX.test(input)).toBeTruthy();
    },
  );

  test.skip.each([
    'calc(100 + (200 * 4))',
    'calc((100px / 2) * 1rem) 60em calc(100px / 3 + (200 / 18))',
    '0 calc((((100vw - 0.625rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 3) 0 calc(((100vw - 0.625rem * 2) / 12 - 1.1458rem) + 1.25rem)',
  ])(
    'Ignores and returns: %s',
    (input) => {
      expect(stripExtraCalc(input)).toEqual(input);
      expect(NESTED_CALC_REGEX.test(input)).toBeFalsy();
    },
  );
});
