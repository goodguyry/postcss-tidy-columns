const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');

function tidyPropagation(declaration, tidy, root) {
  const { columns: { options: { breakpoints } } } = tidy;
  const rule = declaration.parent;

  // Reverse the breakpoints to make sure they're inserted in the correct order.
  Object.keys(breakpoints).reverse().forEach((breakpoint) => {
    // Clone the declaration without `!tidy`.
    const cleanDecl = cleanClone(
      declaration,
      {
        declaration: declaration.prop,
        value: declaration.value.replace(/\s?!tidy/, ''),
      },
    );

    // Clone the rule and add the cloned declaration.
    const newRule = cleanClone(rule);
    newRule.append(cleanDecl);

    // @todo Need to ensure declarations within atrules are applied as expected

    // Create the atRule and append the rule.
    const breakpointAtRule = postcss.atRule({
      name: 'media',
      params: `(min-width: ${breakpoint})`,
      nodes: [],
      source: rule.source,
    }).append(newRule);

    root.insertAfter(rule, breakpointAtRule);
  });

  // Replace the declaration with `!tidy` clipped off.
  declaration.replaceWith(cleanClone(
    declaration,
    {
      declaration: declaration.prop,
      value: declaration.value.replace(/\s?!tidy/, ''),
    },
  ));
}

module.exports = {
  tidyPropagation,
};
