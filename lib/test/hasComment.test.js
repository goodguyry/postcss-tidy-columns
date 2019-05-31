const postcss = require('postcss');
const hasComment = require('../hasComment');

/**
 * Check for an exsiting CSS comment.
 */
describe('Check for an exsiting CSS comment', () => {
  test.each([
    [
      { prop: 'tidy-span', value: '3' },
      'tidy-span: 3',
      true,
    ],
    [
      { prop: 'margin-left', value: 'calc(tidy-span(3) + 1.25rem)' },
      'margin-left: calc(tidy-span(3) + tidy-var(edge))',
      true,
    ],
    [
      { prop: 'tidy-offset-left', value: '5 / 3' },
      'tidy-offset: 3',
      false,
    ],
  ])(
    'Fuzzy matching %O',
    (input, commentInput, expected) => {
      const rule = postcss.rule({ selector: 'div' });

      const decl = postcss.decl(input);
      const comment = postcss.comment({ text: commentInput });

      rule.append(comment);
      rule.append(decl);

      expect(hasComment(decl)).toEqual(expected);
    },
  );
});
