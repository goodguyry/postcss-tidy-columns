/**
 * Test for a comment containing the declaration property.
 *
 * @param {Declaration} declaration The declaration to match.
 *
 * @return {Boolean}
 */
module.exports = function hasComment(declaration) {
  return declaration.parent.some(decl => (
    'comment' === decl.type && decl.text.includes(`${declaration.prop}:`)
  ));
};
