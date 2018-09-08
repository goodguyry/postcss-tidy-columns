/**
 * Clone a node and clean it's raw formatting.
 *
 * @param {Object} node The declaration or rule to be cloned.
 * @param {Object} [overrides={}] The property overrides.
 *
 * @returns {Object}
 */
module.exports = function cleanClone(node, overrides = {}) {
  // Clone the node with overrides.
  const clonedNode = node.clone(Object.assign(overrides, { nodes: [] }));
  // Clear raw formatting, which will be inherited upon insertion.
  clonedNode.cleanRaws();

  return clonedNode;
};
