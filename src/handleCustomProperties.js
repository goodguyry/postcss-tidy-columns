/**
 * Reject usage of CSS Custom Properties in `@tidy max` rules.
 *
 * This is due to `tidy-offset-*` using `max` Media Queries
 * CSS Custom Properties aren't allowed in Media Query parameters.
 *
 * @param {Object} rule   The CSS root object.
 * @param {String} params The `@tidy` rule value.
 */
function handleCustomProperties(rule, params) {
  const [property] = params.match(/^(\S+)\s(.*)/).slice(1);

  if (/max/i.test(property)) {
    // eslint-disable-next-line max-len
    throw rule.error(`CSS Custom Property value is not allowed in \`@tidy ${property}\` declaration`);
  }
}

module.exports = handleCustomProperties;
