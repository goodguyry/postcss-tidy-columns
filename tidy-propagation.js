const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const { parseAtruleParams } = require('./lib/parseAtruleParams');
const compareStrings = require('./lib/compareStrings');

function tidyPropagation(declaration, tidy) {
  const { columns: { options: { breakpoints } } } = tidy;
  const rule = declaration.parent;
  const root = declaration.root();
  let breakpointKeys = Object.keys(breakpoints);

  // Handle parent atRule.
  const hasAtRuleParent = 'atrule' === rule.parent.type;
  const [{ minMax, value }] = hasAtRuleParent
    ? parseAtruleParams(rule.parent.params)
    : [{}];

  // Filter out breakpoint values that don't apply; ignore max-width breakpoints.
  if (hasAtRuleParent && 'min' === minMax) {
    breakpointKeys = breakpointKeys.filter(breakpoint => -1 === compareStrings(value, breakpoint));
  }

  // Clone the declaration without `!tidy`.
  const cleanDecl = cleanClone(
    declaration,
    {
      declaration: declaration.prop,
      value: declaration.value.replace(/\s?\\?!tidy/, ''),
    },
  );

  // Reverse the breakpoints to make sure they're inserted in the correct order.
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
