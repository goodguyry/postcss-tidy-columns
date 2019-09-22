const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const { parseAtruleParams } = require('./lib/parseAtruleParams');
const compareStrings = require('./lib/compareStrings');

/**
 * Duplicate declarations containing `!tidy` into breakpoints corresponding to
 * the plugin configuration.
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} tidy        An instance of the Tidy class.
 */
function tidyPropagation(declaration, tidy) {
  const { columns: { options: { breakpoints } } } = tidy;
  const rule = declaration.parent;
  const root = declaration.root();

  // Test for parent atRule.
  const hasAtRuleParent = ('atrule' === rule.parent.type);
  /**
   * minMax: The media query param's width prefix.
   * value:  The media query param's value.
   */
  const [{ minMax, value }] = hasAtRuleParent
    ? parseAtruleParams(rule.parent.params)
    : [{}];

  // Clone the declaration without `!tidy`.
  const cleanDecl = cleanClone(
    declaration,
    {
      declaration: declaration.prop,
      value: declaration.value.replace(/\s?\\?!tidy/, ''),
    },
  );

  // Configured breakpoint values as an array of strings.
  let breakpointKeys = Object.keys(breakpoints);

  /**
   * Handle parent atRule.
   * Filter out breakpoint values that don't apply, ignoring max-width
   * breakpoints.
   */
  if (hasAtRuleParent && 'min' === minMax) {
    breakpointKeys = breakpointKeys.filter(breakpoint => -1 === compareStrings(value, breakpoint));
  }

  // Collect media queries containing the declaration.
  const atRules = breakpointKeys.reduce((acc, breakpoint) => {
    if ('max' !== minMax) {
      const atRule = postcss.atRule({
        name: 'media',
        params: `(min-width: ${breakpoint})`,
        nodes: [],
        source: rule.source,
      });

      // Clone the rule and add the cloned declaration.
      const newRule = cleanClone(rule);
      newRule.append(cleanDecl.clone());

      // Add the new rule to the atRule.
      atRule.append(newRule);

      return [...acc, atRule];
    }

    return acc;
  }, []);

  // Insert the media query
  if ('atrule' === rule.parent.type) {
    // Insert after the parent at-rule.
    root.insertAfter(rule.parent, atRules);
  } else {
    // Insert after the current rule.
    root.insertAfter(rule, atRules);
  }

  // Replace the declaration with `!tidy` clipped off.
  declaration.replaceWith(cleanDecl.clone());
}

module.exports = {
  tidyPropagation,
};
