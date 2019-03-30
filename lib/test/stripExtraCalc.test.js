const stripExtraCalc = require('../stripExtraCalc');

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
