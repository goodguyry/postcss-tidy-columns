const postcss = require('postcss');
const Tidy = require('./Tidy');
const getGlobalOptions = require('./src/getGlobalOptions');
const { tidyShorthandProperty } = require('./tidy-shorthand-property');
const { tidyProperty } = require('./tidy-property');
const { tidyFunction } = require('./tidy-function');
const { tidyVar } = require('./tidy-var');

/**
 * Parse rules and insert span and offset values.
 *
 * @param {Object} root The root CSS object.
 */
module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-tidy-columns',
  Once(root) {
    // Collect the global options.
    const globalOptions = Object.freeze(getGlobalOptions(root, options));

    // Parse rules and declarations, replace `tidy-` properties.
    root.walkRules((rule) => {
      const tidy = new Tidy(rule, globalOptions);

      // Replace shorthand declarations with their long-form equivalents.
      rule.walkDecls(/^tidy-(column|offset)$/, (declaration) => {
        tidyShorthandProperty(declaration, tidy);
      });

      // Set up rule-specific properties.
      tidy.initRule();

      // Replace `tidy-var()` functions throughout.
      rule.walkDecls((declaration) => {
        tidyVar(declaration, tidy);
      });

      rule.walkDecls((declaration) => {
        // Replace `tidy-*` properties.
        tidyProperty(declaration, tidy);
        // Replace `tidy-[span|offset]()` and `tidy-[span|offset]-full()` functions.
        tidyFunction(declaration, tidy);
      });

      const { fullWidthRule } = tidy;
      const { siteMax } = tidy.columns.options;

      // Add the media query if a siteMax is declared and the `fullWidthRule` has children.
      if (undefined !== siteMax && fullWidthRule.nodes.length > 0) {
        /**
         * The siteMax-width atRule.
         * Contains full-width margin offset declarations.
         */
        const fullWidthAtRule = postcss.atRule({
          name: 'media',
          params: `(min-width: ${siteMax})`,
          nodes: [],
          source: rule.source,
        }).append(fullWidthRule);

        // Insert the media query
        if ('atrule' === rule.parent.type) {
          // Insert after the parent at-rule.
          root.insertAfter(rule.parent, fullWidthAtRule);
        } else {
          // Insert after the current rule.
          root.insertAfter(rule, fullWidthAtRule);
        }
      }
    });
  },
});

module.exports.postcss = true;
