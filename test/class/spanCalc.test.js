const testMethod = require('./testMethod');
const Grid = require('../../Grid');
const config = require('./sharedConfigs');

/**
 * Test column calc() functions.
 */
testMethod({
  description: 'Column CSS calc() function',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Grid(config.allValues).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 32px * 2) / 16 - 0.5859rem)',
        full: 'calc((75rem - 32px * 2) / 16 - 0.5859rem)',
      },
    },
    {
      description: 'All options: multiple columns',
      actual: new Grid(config.allValues).spanCalc(4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 3)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Grid(config.allValues).spanCalc(-4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -3)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -3)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Grid(config.allValues).spanCalc(0.5),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) * 0.5)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) * 0.5)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 1)',
      actual: new Grid(config.allValues).spanCalc(1.75),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 1.75) + 0.625rem)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Grid(config.allValues).spanCalc(2.5),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2.5) + 0.625rem * 2)',
      },
    },
    // ---------- No siteMax
    {
      description: 'No siteMax: single column',
      actual: new Grid(config.edgeGutter).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 1rem * 2) / 12 - 9.1667px)',
      },
    },
    {
      description: 'No siteMax: multiple columns',
      actual: new Grid(config.edgeGutter).spanCalc(3),
      expected: {
        fluid: 'calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 3) + 10px * 2)',
      },
    },
    {
      description: 'No siteMax: negative columns',
      actual: new Grid(config.edgeGutter).spanCalc(-3),
      expected: {
        fluid: 'calc((((100vw - 1rem * 2) / 12 - 9.1667px) * -3) + 10px * -2)',
      },
    },
    // ---------- No gap
    {
      description: 'No gap: single column',
      actual: new Grid(config.edgeCanvas).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 1.25rem * 2) / 16)',
        full: 'calc((1024px - 1.25rem * 2) / 16)',
      },
    },
    {
      description: 'No gap: multiple columns',
      actual: new Grid(config.edgeCanvas).spanCalc(2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * 2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * 2)',
      },
    },
    {
      description: 'No gap: negative columns',
      actual: new Grid(config.edgeCanvas).spanCalc(-2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * -2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * -2)',
      },
    },
    // ---------- No edge
    {
      description: 'No edge: single column',
      actual: new Grid(config.gapCanvas).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 16 - 14.0625px)',
        full: 'calc(60rem / 16 - 14.0625px)',
      },
    },
    {
      description: 'No edge: multiple columns',
      actual: new Grid(config.gapCanvas).spanCalc(3),
      expected: {
        fluid: 'calc(((100vw / 16 - 14.0625px) * 3) + 15px * 2)',
        full: 'calc(((60rem / 16 - 14.0625px) * 3) + 15px * 2)',
      },
    },
    {
      description: 'No edge: negative columns',
      actual: new Grid(config.gapCanvas).spanCalc(-3),
      expected: {
        fluid: 'calc(((100vw / 16 - 14.0625px) * -3) + 15px * -2)',
        full: 'calc(((60rem / 16 - 14.0625px) * -3) + 15px * -2)',
      },
    },
    // ---------- Edges only
    {
      description: 'Edges only: single column',
      actual: new Grid(config.edgeOnly).spanCalc(1),
      expected: {
        fluid: 'calc((100vw - 20px * 2) / 12)',
      },
    },
    {
      description: 'Edges only: multiple columns',
      actual: new Grid(config.edgeOnly).spanCalc(4),
      expected: {
        fluid: 'calc(((100vw - 20px * 2) / 12) * 4)',
      },
    },
    {
      description: 'Edges only: negative columns',
      actual: new Grid(config.edgeOnly).spanCalc(-4),
      expected: {
        fluid: 'calc(((100vw - 20px * 2) / 12) * -4)',
      },
    },
    // ---------- Gutter only
    {
      description: 'Gutter only: single column',
      actual: new Grid(config.gapOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 12 - 0.8594rem)',
      },
    },
    {
      description: 'Gutter only: multiple columns',
      actual: new Grid(config.gapOnly).spanCalc(3),
      expected: {
        fluid: 'calc(((100vw / 12 - 0.8594rem) * 3) + 0.9375rem * 2)',
      },
    },
    {
      description: 'Gutter only: negative columns',
      actual: new Grid(config.gapOnly).spanCalc(-3),
      expected: {
        fluid: 'calc(((100vw / 12 - 0.8594rem) * -3) + 0.9375rem * -2)',
      },
    },
    // ---------- Canvas only
    {
      description: 'Canvas only: single column',
      actual: new Grid(config.siteMaxOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 16)',
        full: 'calc(1200px / 16)',
      },
    },
    {
      description: 'Canvas only: multiple columns',
      actual: new Grid(config.siteMaxOnly).spanCalc(5),
      expected: {
        fluid: 'calc((100vw / 16) * 5)',
        full: 'calc((1200px / 16) * 5)',
      },
    },
    {
      description: 'Canvas only: negative columns',
      actual: new Grid(config.siteMaxOnly).spanCalc(-5),
      expected: {
        fluid: 'calc((100vw / 16) * -5)',
        full: 'calc((1200px / 16) * -5)',
      },
    },
    // ---------- Count only
    {
      description: 'Count only: single column',
      actual: new Grid(config.columnsOnly).spanCalc(1),
      expected: {
        fluid: 'calc(100vw / 12)',
      },
    },
    {
      description: 'Count only: multiple columns',
      actual: new Grid(config.columnsOnly).spanCalc(3),
      expected: {
        fluid: 'calc((100vw / 12) * 3)',
      },
    },
    {
      description: 'Count only: negative columns',
      actual: new Grid(config.columnsOnly).spanCalc(-3),
      expected: {
        fluid: 'calc((100vw / 12) * -3)',
      },
    },
  ],
});
