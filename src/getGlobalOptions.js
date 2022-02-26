const parseOptions = require('./parseOptions');
const collectTidyRuleParams = require('./collectTidyRuleParams');

/**
  * Collect and merge global plugin options.
  *
  * @param  {Object} root    The PostCSS root object.
  * @param  {Object} options The plugin options.
  * @return {Object} The merged global options.
  */
const getGlobalOptions = (root, options) => {
  const defaultOpts = {
    // @tidy options.
    columns: undefined,
    gap: undefined,
    edge: undefined,
    base: 'vw',
    max: undefined,

    // JavaScript options.
    debug: false,
    reduce: false, // @todo Reduce only when this is true,
  };

  // Collect root at-rule values.
  const atRuleParams = collectTidyRuleParams(root, true);

  // Parse the CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  return Object.assign(defaultOpts, options, atRuleOpts);
};

module.exports = getGlobalOptions;
