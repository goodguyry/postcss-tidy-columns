const { isEmpty, isCustomProperty } = require('./lib/values');

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
  const validatedOptions = Object.keys(options)
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

  return validatedOptions;
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
 * @param  {Root|Rule} node The current node.
 * @return {Array}
 */
const collectTidyRuleParams = (node) => {
  const atRuleParams = [];

  node.walkAtRules('tidy', (atrule) => {
    const { params, parent: atRuleParent } = atrule;

    // Make sure the at-rule is the same scope as the node.
    const scopeCheck = ('root' === node.type)
      ? 'root' === atRuleParent.type
      : 'root' !== atRuleParent.type;

    if (scopeCheck) {
      atRuleParams.push(params);
      atrule.remove();
    }
  });

  return atRuleParams;
};

/**
 * Get options from a given node.
 *
 * @param  {Root|Rule} node   The current node.
 * @param  {Object}   options The current options.
 * @return {Object}           The merged local options.
 */
const getOptions = (node, options) => {
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

  // Collect this node's at-rule values.
  const atRuleParams = collectTidyRuleParams(node);

  // Parse the CSS option values.
  const atRuleOpts = parseOptions(atRuleParams);

  if ('root' === node.type) {
    return { ...defaultOpts, ...options, ...atRuleOpts };
  }

  return { ...options, ...atRuleOpts };
};

module.exports = {
  LENGTH_REGEX,
  normalizeOptions,
  parseOptions,
  collectTidyRuleParams,
  getOptions,
};
