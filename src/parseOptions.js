const { normalizeOptions } = require('./normalizeOptions');
const camelCaseString = require('../lib/camelCaseString');

/**
 * Parse and compile CSS @tidy at-rule parameters.
 *
 * @param {Array} optionsArray An array of at-rule params.
 *
 * @return {Object}
 */
function parseOptions(optionsArray) {
  const options = optionsArray.reduce((acc, setting) => {
    /**
     * property: The option name.
     * value:    The option value.
     */
    const [prop, value] = setting.match(/^(\S+)\s(.*)/).slice(1);
    const property = camelCaseString(prop);

    acc[property] = value.trim();

    return acc;
  }, {});

  return normalizeOptions(options);
}

module.exports = parseOptions;
