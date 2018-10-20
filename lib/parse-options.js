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
 * Reject usage of CSS Custom Properties in `@tidy site-max` rules.
 *
 * This is due to `tidy-offset-*` using `site-max` Media Queries
 * CSS Custom Properties aren't allowed in Media Query parameters.
 *
 * @param {Object} rule The CSS root object.
 * @param {String} params The `@tidy` rule value.
 */
function handleCustomProperties(rule, params) {
  const [property] = params.match(/^(\S+)\s(.*)/).slice(1);

  if (/site-?max/i.test(property)) {
    // eslint-disable-next-line max-len
    throw rule.error(`CSS Custom Property value is not allowed in \`@tidy ${property}\` declaration`);
  }
}

/**
 * Collect @tidy params from the provided CSS root.
 *
 * @param {Object} css The CSS root/rule.
 * @param {Boolean} equals Use `===` or `!==` as the `if` statement's condition.
 * @returns
 */
function collectTidyRuleParams(css, equals) {
  // Collect CSS at-rule values.
  const atRuleParams = [];

  css.walkAtRules('tidy', (atrule) => {
    const { params, parent: { type: parentType } } = atrule;
    if (equals ? 'root' === parentType : 'root' !== parentType) {
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
    breakpoints: [],
  };

  // Normalize plugin options.
  const pluginOptions = normalizeOptions(options);

  // Collect root at-rule values.
  const atRuleParams = collectTidyRuleParams(root, true);

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
  // Collect this rule's at-rule values.
  const atRuleParams = collectTidyRuleParams(rule, false);

  // Parse the rule's CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return Object.assign({}, global, atRuleOpts);
}

module.exports = {
  parseOptions,
  getGlobalOptions,
  getLocalOptions,
};
