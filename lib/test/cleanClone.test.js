/* eslint-disable max-len */
const run = require('../../test');
const postcss = require('postcss');
const cleanClone = require('../cleanClone');

/**
 * Create a test plugin for the `cleanClone` helper. Running a test plugin
 * limits the scope, which prevents any other features of the plugin from running.
 */
const runcleanCloneTest = (input, output, opts) => (
  run(input, output, opts, postcss.plugin(
    'cleanclone-test',
    () => function process(root) {
      root.walkDecls((declaration) => {
        declaration.replaceWith(cleanClone(
          declaration,
          opts,
        ));
      });
    },
  ))
);

/**
 * Clone a node and clean it's raw formatting.
 */
describe("Clone a node and clean it's raw formatting", () => {
  test(
    'Clones a node clone with an override',
    () => runcleanCloneTest(
      'div { margin-left: 3px; }',
      'div { foo-bar: baz; }',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );

  test(
    'Clones a node with no override',
    () => runcleanCloneTest(
      'div { padding: 100px; }',
      'div { padding: 100px; }',
      {},
    ),
  );
  test(
    'Clones an empty node with override',
    () => runcleanCloneTest(
      'div {}',
      'div {}',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );

  test(
    'Clones a node with override inside media query',
    () => runcleanCloneTest(
      '@media (min-width: 1024px) { div { padding: 100px; } }',
      '@media (min-width: 1024px) { div { foo-bar: baz; } }',
      { prop: 'foo-bar', value: 'baz' },
    ),
  );
});
