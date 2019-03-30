const { stripExtraCalc, NESTED_CALC_REGEX } = require('../stripExtraCalc');

/**
 * Remove nested calc() function resulting from the tidy-* function replacement.
 */
describe('Remove nested calc() function resulting from the tidy-* function replacement', () => {
  test('Removes calc() function nested immediately inside another calc() function', () => {
    expect(stripExtraCalc('calc(calc(200 * 4) + 100)'))
      .toEqual('calc((200 * 4) + 100)');
  });

  test('Ignores string without a nested calc() function', () => {
    expect(stripExtraCalc('calc(100 + (200 * 4))'))
      .toEqual('calc(100 + (200 * 4))');
  });
});

/**
 * Matches nested calc() functions.
 */
describe('Matches nested calc() functions', () => {
  test.each([
    'calc(calc(2 * 20px) + 100px)',
  ])(
    'Matches a calc() function immediately inside another calc() function',
    (input) => {
      expect(NESTED_CALC_REGEX.test(input)).toBeTruthy();
    },
  );

  test.each([
    'calc(2 * (20px + 100px))',
  ])(
    'Ignores calc() functions that don\'t contain another calc() function',
    (input) => {
      expect(NESTED_CALC_REGEX.test(input)).toBeFalsy();
    },
  );
});
