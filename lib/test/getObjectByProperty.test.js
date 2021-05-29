/* eslint-disable max-len */
const getObjectByProperty = require('../getObjectByProperty');

/**
 * Find an object based on a given property value.
 */
describe('Find an object based on a given property value', () => {
  test.each([
    ['Matches the correct object', 3, 'c', { a: 1, c: 3 }],
    ['No matching object found', 3, 'a', undefined],
    ['Returns the first of multiple matching objects', 1, 'a', { a: 1, b: 2 }],
  ])(
    '%s: %i, %s => %O',
    (description, value, property, expected) => {
      const data = [{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }];
      expect(getObjectByProperty(data, value, property)).toEqual(expected);
    },
  );
});
