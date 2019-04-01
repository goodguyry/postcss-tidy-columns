const { strings, objectsByProperty } = require('../sort');

/**
 * Sort array of strings.
 */
describe('Sort array of strings', () => {
  test.each([
    [
      ['1000px', '600px', '400px'],
      ['400px', '600px', '1000px'],
    ],
  ])(
    'Sorts: %O',
    (input, expected) => {
      expect(input.sort(strings())).toEqual(expected);
    },
  );

  test.each([
    [
      ['1024px'],
    ],
    [
      [],
    ],
  ])(
    'Ignores: %O',
    (input) => {
      expect(input.sort(strings())).toEqual(input);
    },
  );
});

/**
 * Sort an array of objects by an object property.
 */
describe('Sort an array of objects by an object property', () => {
  test('Sorts an array of objects by property', () => {
    /* eslint-disable function-paren-newline */
    expect(
      [
        { breakpoint: '1000px', boo: 100 },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '400px', baz: 'zoo' },
      ].sort(objectsByProperty('breakpoint')))
      .toEqual([
        { breakpoint: '400px', baz: 'zoo' },
        { breakpoint: '600px', foo: 0 },
        { breakpoint: '1000px', boo: 100 },
      ]);
  });
});
