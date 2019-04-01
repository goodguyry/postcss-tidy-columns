const { stripExtraCalc, NESTED_CALC_REGEX } = require('../stripExtraCalc');

/**
 * Remove nested calc() function resulting from the tidy-* function replacement.
 */
describe('Remove nested calc() function resulting from the tidy-* function replacement', () => {
  test.each([
    [
      'calc(calc(200 * 4) + 100)',
      'calc((200 * 4) + 100)',
    ],
    [
      'calc(100 + calc(200 * 4))',
      'calc(100 + (200 * 4))',
    ],
  ])(
    'Matches and cleans: %s',
    (input, expected) => {
      expect(stripExtraCalc(input)).toEqual(expected);
      expect(NESTED_CALC_REGEX.test(input)).toBeTruthy();
    },
  );

  test.each([
    'calc(100 + (200 * 4))',
  ])(
    'Ignores and returns: %s',
    (input) => {
      expect(stripExtraCalc(input)).toEqual(input);
      expect(NESTED_CALC_REGEX.test(input)).toBeFalsy();
    },
  );
});
