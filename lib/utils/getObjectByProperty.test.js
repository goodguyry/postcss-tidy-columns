/* eslint-disable max-len */
const getObjectByProperty = require('./getObjectByProperty');

/**
 * Find an object based on a given property value.
 */
describe('Find an object based on a given property value', () => {
  test('Matches the correct object', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 3, 'c'))
      .toEqual({ a: 1, c: 3 });
  });

  test('No matching object found', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 3, 'a'))
      .toEqual(undefined);
  });

  // TODO: Should this return a match or `undefined`?
  test('Returns the first of multiple matching objects', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 1, 'a'))
      .toEqual({ a: 1, b: 2 });
  });
});
