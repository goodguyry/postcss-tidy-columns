const testMethod = require('./testMethod');
const Grid = require('../../Grid');
const config = require('./sharedConfigs');

/**
 * Test offset calc() functions.
 */
testMethod({
  description: 'Offset CSS calc() function',
  tests: [
    // ---------- All options
    {
      description: 'All options: single column',
      actual: new Grid(config.allValues).offsetCalc(1),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) + 0.625rem)',
      },
    },
    {
      description: 'All options: multiple columns',
      actual: new Grid(config.allValues).offsetCalc(4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 4)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 4) + 0.625rem * 4)',
      },
    },
    {
      description: 'All options: negative columns',
      actual: new Grid(config.allValues).offsetCalc(-4),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -4)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * -4) + 0.625rem * -4)',
      },
    },
    {
      description: 'All options: fractional columns (less than 1)',
      actual: new Grid(config.allValues).offsetCalc(0.75),
      expected: {
        fluid: 'calc(((100vw - 32px * 2) / 16 - 0.5859rem) * 0.75)',
        full: 'calc(((75rem - 32px * 2) / 16 - 0.5859rem) * 0.75)',
      },
    },
    {
      description: 'All options: fractional columns (greater than one)',
      actual: new Grid(config.allValues).offsetCalc(1.5),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 1.5) + 0.625rem)',
      },
    },
    {
      description: 'All options: fractional columns (greater than 2)',
      actual: new Grid(config.allValues).offsetCalc(2.075),
      expected: {
        fluid: 'calc((((100vw - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
        full: 'calc((((75rem - 32px * 2) / 16 - 0.5859rem) * 2.075) + 0.625rem * 2)',
      },
    },
    // ---------- No siteMax
    {
      description: 'No siteMax: single column',
      actual: new Grid(config.edgeGutter).offsetCalc(1),
      expected: {
        fluid: 'calc(((100vw - 1rem * 2) / 12 - 9.1667px) + 10px)',
      },
    },
    {
      description: 'No siteMax: multiple columns',
      actual: new Grid(config.edgeGutter).offsetCalc(3),
      expected: {
        fluid: 'calc((((100vw - 1rem * 2) / 12 - 9.1667px) * 3) + 10px * 3)',
      },
    },
    {
      description: 'No siteMax: negative columns',
      actual: new Grid(config.edgeGutter).offsetCalc(-3),
      expected: {
        fluid: 'calc((((100vw - 1rem * 2) / 12 - 9.1667px) * -3) + 10px * -3)',
      },
    },
    // ---------- No gap
    {
      description: 'No gap: single column',
      actual: new Grid(config.edgeCanvas).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw - 1.25rem * 2) / 16)',
        full: 'calc((1024px - 1.25rem * 2) / 16)',
      },
    },
    {
      description: 'No gap: multiple columns',
      actual: new Grid(config.edgeCanvas).offsetCalc(2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * 2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * 2)',
      },
    },
    {
      description: 'No gap: negative columns',
      actual: new Grid(config.edgeCanvas).offsetCalc(-2),
      expected: {
        fluid: 'calc(((100vw - 1.25rem * 2) / 16) * -2)',
        full: 'calc(((1024px - 1.25rem * 2) / 16) * -2)',
      },
    },
    // ---------- No edge
    {
      description: 'No edge: single column',
      actual: new Grid(config.gapCanvas).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw / 16 - 14.0625px) + 15px)',
        full: 'calc((60rem / 16 - 14.0625px) + 15px)',
      },
    },
    {
      description: 'No edge: multiple columns',
      actual: new Grid(config.gapCanvas).offsetCalc(2),
      expected: {
        fluid: 'calc(((100vw / 16 - 14.0625px) * 2) + 15px * 2)',
        full: 'calc(((60rem / 16 - 14.0625px) * 2) + 15px * 2)',
      },
    },
    {
      description: 'No edge: negative columns',
      actual: new Grid(config.gapCanvas).offsetCalc(-2),
      expected: {
        fluid: 'calc(((100vw / 16 - 14.0625px) * -2) + 15px * -2)',
        full: 'calc(((60rem / 16 - 14.0625px) * -2) + 15px * -2)',
      },
    },
    // ---------- Edges only
    {
      description: 'Edges only: single column',
      actual: new Grid(config.edgeOnly).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw - 20px * 2) / 12)',
      },
    },
    {
      description: 'Edges only: multiple columns',
      actual: new Grid(config.edgeOnly).offsetCalc(2),
      expected: {
        fluid: 'calc(((100vw - 20px * 2) / 12) * 2)',
      },
    },
    {
      description: 'Edges only: negative columns',
      actual: new Grid(config.edgeOnly).offsetCalc(-2),
      expected: {
        fluid: 'calc(((100vw - 20px * 2) / 12) * -2)',
      },
    },
    // ---------- Gutter only
    {
      description: 'Gutter only: single column',
      actual: new Grid(config.gapOnly).offsetCalc(1),
      expected: {
        fluid: 'calc((100vw / 12 - 0.8594rem) + 0.9375rem)',
      },
    },
    {
      description: 'Gutter only: multiple columns',
      actual: new Grid(config.gapOnly).offsetCalc(3),
      expected: {
        fluid: 'calc(((100vw / 12 - 0.8594rem) * 3) + 0.9375rem * 3)',
      },
    },
    {
      description: 'Gutter only: negative columns',
      actual: new Grid(config.gapOnly).offsetCalc(-3),
      expected: {
        fluid: 'calc(((100vw / 12 - 0.8594rem) * -3) + 0.9375rem * -3)',
      },
    },
    // ---------- Canvas only
    {
      description: 'Canvas only: single column',
      actual: new Grid(config.siteMaxOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(100vw / 16)',
        full: 'calc(1200px / 16)',
      },
    },
    {
      description: 'Canvas only: multiple columns',
      actual: new Grid(config.siteMaxOnly).offsetCalc(5),
      expected: {
        fluid: 'calc((100vw / 16) * 5)',
        full: 'calc((1200px / 16) * 5)',
      },
    },
    {
      description: 'Canvas only: negative columns',
      actual: new Grid(config.siteMaxOnly).offsetCalc(-5),
      expected: {
        fluid: 'calc((100vw / 16) * -5)',
        full: 'calc((1200px / 16) * -5)',
      },
    },
    // ---------- Count only
    {
      description: 'Count only: single column',
      actual: new Grid(config.columnsOnly).offsetCalc(1),
      expected: {
        fluid: 'calc(100vw / 12)',
      },
    },
    {
      description: 'Count only: multiple columns',
      actual: new Grid(config.columnsOnly).offsetCalc(4),
      expected: {
        fluid: 'calc((100vw / 12) * 4)',
      },
    },
    {
      description: 'Count only: negative columns',
      actual: new Grid(config.columnsOnly).offsetCalc(-4),
      expected: {
        fluid: 'calc((100vw / 12) * -4)',
      },
    },
  ],
});
