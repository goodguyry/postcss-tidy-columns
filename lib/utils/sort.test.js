const { strings, objectsByProperty } = require('./sort');

describe('Sort breakpoints array', () => {
  test('Multiple values', () => {
    expect(['1000px', '600px', '400px'].sort(strings()))
      .toEqual(['400px', '600px', '1000px']);
  });

  test('Single value', () => {
    expect(['1024px'].sort(strings()))
      .toEqual(['1024px']);
  });

  test('No values', () => {
    expect([].sort(strings()))
      .toEqual([]);
  });
});

describe('Sort Objects', () => {
  test('Test one', () => {
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
