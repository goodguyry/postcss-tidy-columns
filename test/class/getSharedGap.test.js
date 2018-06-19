const testMethod = require('./testMethod');
const Grid = require('../../Grid');
const config = require('./sharedConfigs');

/**
 * Test calculating the shared gap value based on the given options.
 */
testMethod({
  description: 'Calculate the shared gap value',
  tests: [
    {
      description: '0.625rem @ 16 columns',
      actual: new Grid(config.allValues).getSharedGap(),
      expected: '0.5859rem',
    },
    {
      description: '10px @ 12 columns',
      actual: new Grid(config.edgeGutter).getSharedGap(),
      expected: '9.1667px',
    },
    {
      description: 'zero @ 16 columns',
      actual: new Grid(config.edgeCanvas).getSharedGap(),
      expected: 0,
    },
    {
      description: '15px @ 16 columns',
      actual: new Grid(config.gapCanvas).getSharedGap(),
      expected: '14.0625px',
    },
    {
      description: '0.9375rem @ 12 columns',
      actual: new Grid(config.gapOnly).getSharedGap(),
      expected: '0.8594rem',
    },
  ],
});
