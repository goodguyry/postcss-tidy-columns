const handleCustomProperties = require('./handleCustomProperties');

/**
 * Pattern to match CSS Custom Properties.
 *
 * @type {RegExp}
 */
const CUSTOM_PROP_REGEX = /var\(\s?(--[\w-]+)\s?\)/;

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
      if (CUSTOM_PROP_REGEX.test(params)) {
        handleCustomProperties(atrule, params);
      }

      atRuleParams.push(params);
      atrule.remove();
    }
  });

  return atRuleParams;
}

module.exports = {
  collectTidyRuleParams,
  CUSTOM_PROP_REGEX,
};
