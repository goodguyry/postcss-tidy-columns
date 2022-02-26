const parseOptions = require('./parseOptions');
const collectTidyRuleParams = require('./collectTidyRuleParams');

/**
 * Walk any `tidy` at-rules and collect locally-scoped options.
 *
 * @param  {Object} rule   The current rule.
 * @param  {Object} global The global options.
 * @return {Object} The merged local options.
 */
const getLocalOptions = (rule, global) => {
  // Collect this rule's at-rule values.
  const atRuleParams = collectTidyRuleParams(rule, false);

  // Parse the rule's CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return { ...global, ...atRuleOpts };
};

module.exports = getLocalOptions;
