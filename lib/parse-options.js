const { normalizeOptions, varPattern } = require('./normalize-options');

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
 * Get a CSS Custom Property's real value.
 *
 * @param {object} root The CSS root.
 * @param {string} params The raw option value.
 */
function getCustomPropertyValue(root, params) {
  const [prop, value] = params.match(/^(\S+)\s(.*)/).slice(1);
  const [, customProp] = value.match(varPattern);

  // Collect root-level `:root{}` child declarations matching the custom property.
  const customPropertyNodes = root.nodes
    .reduce((acc, node) => {
      if (
        'rule' === node.type &&
        ':root' === node.selector &&
        'root' === node.parent.type
      ) {
        return [...acc, ...node.nodes];
      }
      return acc;
    }, [])
    .filter(node => customProp === node.prop);

  // TODO: Print warning if not found.
  // TODO: Print warning if more than one found.
  // Rebuild param string.
  return (
    '' !== customPropertyNodes[0].value ?
      `${prop} ${customPropertyNodes[0].value}` :
      params
  );
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
      const { params } = atrule;
      // Find site-max real value if a custom property.
      if (varPattern.test(params) && /site-?max/i.test(params)) {
        const newParams = getCustomPropertyValue(root, params);
        atRuleParams.push(newParams);
      } else {
        atRuleParams.push(params);
      }
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
