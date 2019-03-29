const compareStrings = require('./compareStrings');

describe('Compare numerical strings', () => {
  test('The reference string is larger than the compare string', () => {
    expect(compareStrings('1000px', '600px'))
      .toEqual(1);
  });

  test('The reference and compare strings are same', () => {
    expect(compareStrings('600px', '600px'))
      .toEqual(0);
  });

  test('The reference string is smaller than the compare string', () => {
    expect(compareStrings('400px', '1000px'))
      .toEqual(-1);
  });
});
