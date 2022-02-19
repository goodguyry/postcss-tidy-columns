const handleCustomProperties = require('./handleCustomProperties');
const { isCustomProperty } = require('../lib/isCustomProperty');

/**
 * Collect @tidy params from the provided CSS root.
 *
 * @param {Object}  css         The CSS root/rule.
 * @param {Boolean} fromCssRoot Options collected from CSS Root.
 *
 * @return {Array}
 */
module.exports = function collectTidyRuleParams(css, fromCssRoot) {
  // Collect CSS at-rule values.
  const atRuleParams = [];

  css.walkAtRules('tidy', (atrule) => {
    const { params, parent: { type: parentType } } = atrule;
    const rootCheck = (fromCssRoot ? 'root' === parentType : 'root' !== parentType);

    if (rootCheck) {
      // Reject `max` with CSS Custom Property.
      if (isCustomProperty(params)) {
        handleCustomProperties(atrule, params);
      }

      atRuleParams.push(params);
      atrule.remove();
    }
  });

  return atRuleParams;
};
