const testMethod = require('./testMethod');
const Grid = require('../../Grid');

/**
 * Test splitting CSS values into [number, unit] arrays.
 */
testMethod({
  description: 'Split CSS Units',
  tests: [
    {
      description: 'px',
      actual: Grid.splitCssUnit('10px'),
      expected: [10, 'px'],
    },
    {
      description: 'rem',
      actual: Grid.splitCssUnit('0.625rem'),
      expected: [0.625, 'rem'],
    },
    {
      description: 'em',
      actual: Grid.splitCssUnit('2em'),
      expected: [2, 'em'],
    },
    {
      description: 'Zero',
      actual: Grid.splitCssUnit(0),
      expected: 0,
    },
  ],
});
