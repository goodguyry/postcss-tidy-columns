const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const { parseAtruleParams } = require('./lib/parseAtruleParams');
const compareStrings = require('./lib/compareStrings');

/**
 * Pattern to match `tidy-*` functions in declaration values.
 *
 * @type {RegExp}
 */
const FUNCTION_REGEX = /tidy-(span|offset)(-full)?\(([\d.-]+)\)/;

/**
 * Get the siteMax definition from the options object.
 *
 * @param  {Object} options The plugin options.
 * @return {String|Boolean} The siteMax definition, or false if there is none.
 */
function getSiteMax(options) {
  const { siteMax, breakpoints } = options;
  const collectedValues = [];

  // Push any root definition to the collected values.
  if (undefined !== siteMax) {
    collectedValues.push(siteMax);
  }

  // Get any definitions within the breakpoints.
  if (undefined !== breakpoints) {
    const siteMaxValues = Object.keys(breakpoints).reduce((acc, bp) => {
      if (undefined !== breakpoints[bp].siteMax) {
        return [...acc, breakpoints[bp].siteMax];
      }

      return acc;
    }, collectedValues);

    // We only want the last definition.
    return siteMaxValues.pop();
  }

  // Return the value from the root, or false if there is none.
  return (0 < collectedValues.length) ? collectedValues.pop() : false;
}

/**
 * Duplicate declarations containing `!tidy` into breakpoints corresponding to
 * the plugin configuration.
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} tidy        An instance of the Tidy class.
 */
function tidyPropagation(declaration, tidy) {
  const { columns: { options } } = tidy;
  const { breakpoints } = options;
  const siteMax = getSiteMax(options);

  // Containers.
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

  /**
   * The siteMax-width atRule.
   * Contains full-width margin offset declarations.
   *
   * @todo only create this if siteMax is found.
   */
  const fullWidthAtRule = postcss.atRule({
    name: 'media',
    params: `(min-width: ${siteMax})`,
    nodes: [],
    source: rule.source,
  });

  if (FUNCTION_REGEX.test(declaration.value)) {
    /**
     * match:    The full function expression.
     * slug:     One of either `span` or `offset`.
     * modifier: One of either `undefined` or `-full`.
     * value:    The function's argument.
     */
    const [match, slug, modifier, functionValue] = declaration.value.match(FUNCTION_REGEX);
    if (undefined === modifier) {
      // Clone the rule and add the cloned declaration.
      const newRule = cleanClone(rule);

      newRule.append(cleanDecl.clone({
        value: declaration.value
          .replace(match, `tidy-${slug}-full(${functionValue})`)
          .replace(/\s?\\?!tidy/, ''),
      }));

      fullWidthAtRule.append(newRule);
    }
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

  if (false !== siteMax && 0 < fullWidthAtRule.nodes.length) {
    atRules.push(fullWidthAtRule);
  }

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
  getSiteMax,
};
