const { isEmpty, isCustomProperty } = require('../lib/values');

/**
 * Matches CSS length values of the supported unit values (px, em, rem).
 *
 * @type {RegExp}
 */
const LENGTH_REGEX = /[0-9.]+(px|r?em)+$/;

/**
 * Normalize option value types.
 * Since CSS values are always strings, we need to do some type checking.
 *
 * @param  {Object} options The options object.
 * @return {Object}
 */
const normalizeOptions = (options) => {
  const validateOptions = Object.keys(options)
    .reduce((acc, key) => {
      const option = options[key];

      // Short circuit if the value is falsy.
      if (isEmpty(option)) {
        acc[key] = undefined;
        return acc;
      }

      if (isCustomProperty(option)) {
        // Use the raw option value if it's a var() function.
        acc[key] = option;
      } else {
        // `columns` should be a number.
        if ('columns' === key && !Number.isNaN(Number(option))) {
          acc.columns = Number(option);
        }

        // Base should be 'vw' or '%'.
        if ('base' === key && ['vw', '%'].includes(option)) {
          acc.base = ('%' === option) ? option : 'vw';
        }

        // `debug` and `reduce` should be a Boolean value.
        if (['debug', 'reduce'].includes(key) && 'true' === String(option)) {
          acc[key] = true;
        }

        // These should all be valid, positive CSS length values.
        if (['gap', 'edge', 'max'].includes(key) && LENGTH_REGEX.test(option)) {
          acc[key] = option;
        }
      }

      return acc;
    }, {});

  return validateOptions;
};

/**
 * Parse and compile CSS @tidy at-rule parameters.
 *
 * @param  {Array} optionsArray An array of at-rule params.
 * @return {Object}
 */
const parseOptions = (optionsArray) => {
  const options = optionsArray.reduce((acc, setting) => {
    /**
     * property: The option name.
     * value:    The option value.
     */
    const [prop, value] = setting.match(/^(\S+)\s(.*)/).slice(1);

    acc[prop] = value.trim();

    return acc;
  }, {});

  return normalizeOptions(options);
};

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

module.exports = {
  LENGTH_REGEX,
  normalizeOptions,
  parseOptions,
  collectTidyRuleParams,
  getLocalOptions,
  getGlobalOptions,
};
