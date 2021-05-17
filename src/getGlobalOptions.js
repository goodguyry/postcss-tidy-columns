const parseOptions = require('./parseOptions');
const { normalizeOptions } = require('./normalizeOptions');
const collectTidyRuleParams = require('./collectTidyRuleParams');

/**
  * Collect and merge global plugin options.
  *
  * @param {Object} root    The PostCSS root object.
  * @param {Object} options The plugin options.
  *
  * @return {Object} The merged global options.
  */
function getGlobalOptions(root, options) {
  // Default column options.
  const defaultOpts = {
    columns: undefined,
    gap: undefined,
    siteMax: undefined,
    edge: undefined,
    debug: false,
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

module.exports = getGlobalOptions;
