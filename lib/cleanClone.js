/**
 * Clone a declaration and clean it's raw formatting.
 *
 * @param {Object} declaration The declaration to be cloned.
 * @param {Object} [overrides={}] The property overrides.
 *
 * @returns {Object}
 */
module.exports = function cleanClone(declaration, overrides = {}) {
  // Clone the declaration with overrides.
  const clonedDeclaration = declaration.clone(overrides);
  // Clear raw formatting, which will be inherited upon insertion.
  clonedDeclaration.cleanRaws();

  return clonedDeclaration;
};
