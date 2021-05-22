const breakpointMatch = require('./breakpointMatch');
const parseOptions = require('./parseOptions');
const collectTidyRuleParams = require('./collectTidyRuleParams');

/**
 * Walk any `tidy` at-rules and collect locally-scoped options.
 *
 * @param {Object} rule   The current rule.
 * @param {Object} global The global options.
 *
 * @return {Object} The merged local options.
 */
function getLocalOptions(rule, global) {
  const breakpointConfig = ('atrule' === rule.parent.type)
    ? breakpointMatch(rule.parent.params, global)
    : {};

  // Collect this rule's at-rule values.
  const atRuleParams = collectTidyRuleParams(rule, false);

  // Parse the rule's CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return Object.assign({}, global, breakpointConfig, atRuleOpts);
}

module.exports = getLocalOptions;
