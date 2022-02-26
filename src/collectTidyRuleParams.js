/**
 * Collect @tidy params from the provided CSS root.
 *
 * @param  {Object}  css         The CSS root/rule.
 * @param  {Boolean} fromCssRoot Options collected from CSS Root.
 * @return {Array}
 */
const collectTidyRuleParams = (css, fromCssRoot) => {
  // Collect CSS at-rule values.
  const atRuleParams = [];

  css.walkAtRules('tidy', (atrule) => {
    const { params, parent: { type: parentType } } = atrule;
    const rootCheck = (fromCssRoot ? 'root' === parentType : 'root' !== parentType);

    if (rootCheck) {
      atRuleParams.push(params);
      atrule.remove();
    }
  });

  return atRuleParams;
};

module.exports = collectTidyRuleParams;
