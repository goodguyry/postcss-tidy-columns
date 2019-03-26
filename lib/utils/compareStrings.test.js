const compareStrings = require('./compareStrings');

describe('Compare strings', () => {
  test('Reference occurs after compare', () => {
    expect(compareStrings('1000px', '600px'))
      .toEqual(1);
  });

  test('Reference and compare are same', () => {
    expect(compareStrings('600px', '600px'))
      .toEqual(0);
  });

  test('Reference occurs before compare', () => {
    expect(compareStrings('400px', '1000px'))
      .toEqual(-1);
  });
});
