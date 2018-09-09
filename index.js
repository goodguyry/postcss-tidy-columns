const postcss = require('postcss');
const Tidy = require('./Tidy');
const { getGlobalOptions } = require('./lib/parse-options');
const cleanClone = require('./lib/cleanClone');
const tidyShorthandProperty = require('./lib/tidy-shorthand-property');
const tidyProperty = require('./lib/tidy-property');
const tidyFunction = require('./lib/tidy-function');

/**
 * Parse rules and insert span and offset values.
 *
 * @param {Object} root The root CSS object.
 */
module.exports = postcss.plugin(
  'postcss-tidy-columns',
  (options = {}) => function postcssTidyColumns(root) {
    // Collect the global options.
    const globalOptions = Object.freeze(getGlobalOptions(root, options));

    // Parse rules and declarations, replace `tidy-` properties.
    root.walkRules((rule) => {
      const tidy = new Tidy(rule, globalOptions);

      // Replace shorthand declarations with their long-form equivalents.
      rule.walkDecls(/^tidy-(column|offset)$/, (declaration) => {
        tidyShorthandProperty(declaration);
      });

      // Set up rule-specific properties.
      tidy.initRule();

      rule.walkDecls((declaration) => {
        // Replace `tidy-*` properties.
        tidyProperty(declaration, tidy);
        // Replace `tidy-[span|offset]()` and `tidy-[span|offset]-full()` functions.
        tidyFunction(declaration, tidy);
      });

      const { fullWidthRule, shouldAddGapDecl } = tidy;
      const { siteMax } = tidy.grid.options;

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

      /**
       * Add the margin declaration here in order to maintain expected source order.
       * This is the :last-of-type override for the gap margins.
       */
      if (shouldAddGapDecl) {
        rule.parent.insertAfter(rule, cleanClone(
          rule,
          {
            selector: `${rule.selector}:last-of-type`,
          },
        ).append({
          prop: 'margin-right',
          value: '0',
          source: tidy.declarationSource,
        }));
      }
    });
  },
);

// module.exports = postcss.plugin('postcss-tidy-columns', postcssTidyColumns);
