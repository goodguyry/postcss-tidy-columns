/* eslint-disable max-len */
const { run } = require('../../index.test.js');
const postcss = require('postcss');
const cleanClone = require('./cleanClone');

/**
 * Create a test plugin for the `cleanClone` helper. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const cleanClonePlugin = postcss.plugin(
  'cleanclone-test',
  () => function process(root) {
    root.walkDecls((declaration) => {
      declaration.replaceWith(cleanClone(
        declaration,
        {
          prop: 'foo-bar',
          value: 'baz',
        },
      ));
    });
  },
);

/**
 * Run the test plugin and return the output.
 */
const runcleanCloneTest = (input, output) => run(input, output, {}, cleanClonePlugin);

/**
 * Test cleanClone.
 */
describe('Test `cleanClone` node cloning', () => {
  test(
    'Basic test',
    () => runcleanCloneTest(
      'div { margin-left: 3px; }',
      'div { foo-bar: baz; }',
    ),
  );

  test(
    'Empty node test',
    () => runcleanCloneTest(
      'div {}',
      'div {}',
    ),
  );

  test(
    'Media query test',
    () => runcleanCloneTest(
      '@media (min-width: 1024px) { div { padding: 100px; } }',
      '@media (min-width: 1024px) { div { foo-bar: baz; } }',
    ),
  );
});
