const varPattern = require('../lib/varPattern');
const handleCustomProperties = require('./handleCustomProperties');

/**
 * Collect @tidy params from the provided CSS root.
 *
 * @param {Object}  css         The CSS root/rule.
 * @param {Boolean} fromCssRoot Options collected from CSS Root.
 *
 * @return {Array}
 */
function collectTidyRuleParams(css, fromCssRoot) {
  // Collect CSS at-rule values.
  const atRuleParams = [];

  css.walkAtRules('tidy', (atrule) => {
    const { params, parent: { type: parentType } } = atrule;
    const rootCheck = (fromCssRoot ? 'root' === parentType : 'root' !== parentType);

    if (rootCheck) {
      // Reject `site-max` with CSS Custom Property.
      if (varPattern.test(params)) {
        handleCustomProperties(atrule, params);
      }

      atRuleParams.push(params);
      atrule.remove();
    }
  });

  return atRuleParams;
}

module.exports = collectTidyRuleParams;
