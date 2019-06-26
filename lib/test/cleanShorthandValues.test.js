const cleanShorthandValues = require('../cleanShorthandValues');

/**
 * Clean and trim shorthand property values.
 */
describe('Clean and trim shorthand property values', () => {
  test('Removes slashes, spaces, and invalid/unneeded values', () => {
    expect(cleanShorthandValues({
      surroundingSpaces: ' 1 ',
      offsetSlash: '/ 4',
      slashSpan: '/ span 3',
      none: 'none',
      zero: '0',
    }))
      .toEqual({
        surroundingSpaces: '1',
        offsetSlash: '4',
        slashSpan: '3',
      });
  });
});
