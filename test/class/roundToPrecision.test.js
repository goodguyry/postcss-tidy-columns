const testMethod = require('./testMethod');
const Grid = require('../../Grid');

/**
 * Test rounding numbers to a given precision.
 */
testMethod({
  description: 'Round numbers to precision',
  tests: [
    {
      description: 'Precision (1)',
      actual: Grid.roundToPrecision(1.2345, 1),
      expected: 1.2,
    },
    {
      description: 'Precision (2)',
      actual: Grid.roundToPrecision(1.2345, 2),
      expected: 1.23,
    },
    {
      description: 'Precision (3)',
      actual: Grid.roundToPrecision(1.2345, 3),
      expected: 1.235,
    },
    {
      description: 'Precision (4)',
      actual: Grid.roundToPrecision(1.2345, 4),
      expected: 1.2345,
    },
    {
      description: 'Precision larger than input decimal places',
      actual: Grid.roundToPrecision(1.2, 4),
      expected: 1.2,
    },
    {
      description: 'Whole number',
      actual: Grid.roundToPrecision(1, 1),
      expected: 1,
    },
    {
      description: 'Floating point to zero precision',
      actual: Grid.roundToPrecision(1.234, 0),
      expected: 1,
    },
    {
      description: 'Round zero to precision',
      actual: Grid.roundToPrecision(0, 1),
      expected: 0,
    },
    {
      description: 'Negative number',
      actual: Grid.roundToPrecision(-1.2345, 2),
      expected: -1.23,
    },
  ],
});
