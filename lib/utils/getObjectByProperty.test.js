/* eslint-disable max-len */
const getObjectByProperty = require('./getObjectByProperty');

describe('Test getObjectByProperty', () => {
  test('Multiple objects', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 3, 'c'))
      .toEqual({ a: 1, c: 3 });
  });

  test('No matching object', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 3, 'a'))
      .toEqual(undefined);
  });

  // TODO: Should this return a match or `undefined`?
  test('Multiple matching objects: returns the first match', () => {
    expect(getObjectByProperty([{ a: 1, b: 2 }, { a: 1, c: 3 }, { b: 2, d: 4 }], 1, 'a'))
      .toEqual({ a: 1, b: 2 });
  });
});
