const cleanClone = require('./lib/cleanClone');
const getObjectByProperty = require('./lib/getObjectByProperty');

function tidyPropagation(declaration, tidy, root) {
  const { atRules, columns: { options: { breakpoints } } } = tidy;
  const rule = declaration.parent;

  // Reverse the breakpoints to make sure they're inserted in the correct order.
  Object.keys(breakpoints).reverse().forEach((breakpoint) => {
    const atRule = getObjectByProperty(atRules, `(min-width: ${breakpoint})`, 'params');

    if (undefined !== atRule) {
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

      atRule.append(newRule);

      root.insertAfter(rule, atRule);
    }

    // Replace the declaration with `!tidy` clipped off.
    declaration.replaceWith(cleanClone(
      declaration,
      {
        declaration: declaration.prop,
        value: declaration.value.replace(/\s?!tidy/, ''),
      },
    ));
  });
}

module.exports = {
  tidyPropagation,
};
