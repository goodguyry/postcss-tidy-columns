/**
 * Clones a node and clean it's raw formatting.
 *
 * @param  {Declaration|Rule} node           The declaration or rule to be cloned.
 * @param  {Object}           [overrides={}] The property overrides.
 * @return {Declaration|Rule}
 */
function cleanClone(node, overrides = {}) {
  const cleaner = (node.nodes) ? { nodes: [] } : {};
  // Clone the node with overrides.
  const clonedNode = node.clone({ ...overrides, ...cleaner });
  // Clear raw formatting, which will be inherited upon insertion.
  clonedNode.cleanRaws();

  return clonedNode;
}

module.exports = cleanClone;
