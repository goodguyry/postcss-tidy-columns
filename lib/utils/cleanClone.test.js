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
  opts => function process(root) {
    root.walkDecls((declaration) => {
      declaration.replaceWith(cleanClone(
        declaration,
        opts,
      ));
    });
  },
);

/**
 * Run the test plugin and return the output.
 */
const runcleanCloneTest = (input, output, opts) => run(input, output, opts, cleanClonePlugin);

/**
 * Test cleanClone.
 */
describe('Test `cleanClone` node cloning', () => {
  test(
    'Basic clone with overrides',
    () => runcleanCloneTest(
      'div { margin-left: 3px; }',
      'div { foo-bar: baz; }',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );

  test(
    'Basic clone without overrides',
    () => runcleanCloneTest(
      'div { padding: 100px; }',
      'div { padding: 100px; }',
      {},
    ),
  );
  test(
    'Empty node with overrides',
    () => runcleanCloneTest(
      'div {}',
      'div {}',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );

  test(
    'Media query',
    () => runcleanCloneTest(
      '@media (min-width: 1024px) { div { padding: 100px; } }',
      '@media (min-width: 1024px) { div { foo-bar: baz; } }',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );
});
