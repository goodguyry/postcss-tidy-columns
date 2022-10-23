const TidyColumns = require('./TidyColumns');
const { tidyFunction } = require('./src/tidy-function');
const { tidyVar } = require('./src/tidy-var');
const tidyDeprecated = require('./src/tidy-deprecated');

/**
 * Parse rules and insert span and offset values.
 *
 * @param {Object} options The plugin options.
 */
module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-tidy-columns',
  prepare() {
    const tidy = new TidyColumns(options);

    return {
      /**
       * Collect the global at-rule options.
       */
      Once(root) {
        tidy.initRoot(root);
      },

      /**
       * Set up rule-specific options and properties.
       */
      Rule(rule) {
        tidy.initRule(rule);
      },

      /**
       * Replace tidy functions.
       */
      Declaration(declaration, { result }) {
        // Handle deprecated properties.
        tidyDeprecated(declaration, result);

        // Replace `tidy-var()` functions.
        tidyVar(declaration, tidy, result);

        // Replace `tidy-[span|offset]()` functions.
        tidyFunction(declaration, tidy, result);
      },
    };
  },
});

module.exports.postcss = true;
