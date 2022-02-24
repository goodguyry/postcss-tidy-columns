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
  prepare() {
    let globalOptions = {};
    let tidy = {};

    return {
      /**
       * Collect the global options.
       */
      Once(root) {
        globalOptions = Object.freeze(getGlobalOptions(root, options));
      },

      /**
       * Set up rule-specific properties.
       */
      Rule(rule) {
        tidy = new Tidy(rule, globalOptions);

        // Set up rule-specific properties.
        tidy.initRule();
      },

      /**
       * Replace shorthand properties and option value references first
       */
      Declaration(declaration) {
        // Replace shorthand declarations with their long-form equivalents.
        if (
          declaration.prop.includes('tidy-column')
          || declaration.prop.includes('tidy-offset')
        ) {
          tidyShorthandProperty(declaration, tidy);
        }

        // Replace `tidy-var()` functions throughout.
        if (declaration.value.includes('tidy-var')) {
          tidyVar(declaration, tidy);
        }
      },

      /**
       * Replace property and function values with columns expressions.
       */
      RuleExit(rule, { result, atRule }) {
        rule.walkDecls((declaration) => {
          // Replace `tidy-*` properties.
          if (
            declaration.prop.includes('tidy-span')
            || declaration.prop.includes('tidy-offset')
          ) {
            tidyProperty(declaration, tidy);
          }

          // Replace `tidy-[span|offset]()` functions.
          if (
            declaration.value.includes('tidy-span')
            || declaration.value.includes('tidy-offset')
          ) {
            tidyFunction(declaration, tidy);
          }
        });

        const { fullWidthRule } = tidy;
        const { max } = tidy.columns.options;
        const { root } = result;

        // Add the media query if a max is declared and the `fullWidthRule` has children.
        if (undefined !== max && fullWidthRule.nodes.length > 0) {
          /**
           * The max-width atRule.
           * Contains full-width margin offset declarations.
           */
          const fullWidthAtRule = atRule({
            name: 'media',
            params: `(min-width: ${max})`,
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
      },
    };
  },
});

module.exports.postcss = true;
