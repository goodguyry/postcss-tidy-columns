const { normalizeOptions } = require('./normalize-options');

/**
 * Camelcase the hyphenated property names.
 * `siteMax` can be passed as `site-max` in CSS because it's more "CSS-like".
 *
 * @param {string} property A property name to camelcase.
 */
function camelCaseProperty(property) {
  return property.split('-').map((word, i) =>
    ((i !== 0) ? word.charAt(0).toUpperCase() + word.slice(1) : word)).join('');
}

/**
 * Parse and compile CSS @tidy at-rule parameters.
 *
 * @param {Array} optionsArray An array of at-rule params.
 *
 * @returns {Object}
 */
function parseOptions(optionsArray) {
  const options = optionsArray.reduce((acc, setting) => {
    /**
     * property: The option name.
     * value:    The option value.
     */
    const [prop, value] = setting.match(/^(\S+)\s(.*)/).slice(1);
    const property = camelCaseProperty(prop);

    if ('gap' === property) {
      // Split the `gap` and `addGap`.
      const [gap, addGap] = value.split('/');

      acc[property] = gap.trim();
      // This is either `undefined` or a string.
      acc.addGap = undefined === addGap ? undefined : addGap.trim();
    } else {
      acc[property] = value.trim();
    }

    return acc;
  }, {});

  return normalizeOptions(options);
}

/**
  * Collect and merge global plugin options.
  *
  * @param {Object} root    The PostCSS root object.
  * @param {Object} options The plugin options.
  *
  * @returns {Object} The merged global options.
  */
function getGlobalOptions(root, options) {
  // Default column options.
  const defaultOpts = {
    columns: undefined,
    gap: undefined,
    addGap: false,
    siteMax: undefined,
    edge: undefined,
  };

  // Normalize plugin options.
  const pluginOptions = normalizeOptions(options);

  // Collect CSS at-rule values.
  const atRuleParams = [];
  root.walkAtRules('tidy', (atrule) => {
    if ('root' === atrule.parent.type) {
      atRuleParams.push(atrule.params);
      atrule.remove();
    }
  });

  // Parse the CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return Object.assign(defaultOpts, pluginOptions, atRuleOpts);
}

/**
 * Walk any `tidy` at-rules and collect locally-scoped options.
 *
 * @param {Object} rule   The current rule.
 * @param {Object} global The global options.
 *
 * @returns {Object} The merged local options.
 */
function getLocalOptions(rule, global) {
  // Collect CSS at-rule values.
  const atRuleParams = [];
  rule.walkAtRules('tidy', (atrule) => {
    if ('root' !== atrule.parent.type) {
      atRuleParams.push(atrule.params);
      atrule.remove();
    }
  });

  // Parse the rule's CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return Object.assign({}, global, atRuleOpts);
}

module.exports = {
  parseOptions,
  getGlobalOptions,
  getLocalOptions,
};
