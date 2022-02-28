const TidyColumns = require('./TidyColumns');
const { tidyFunction } = require('./src/tidy-function');
const { tidyVar } = require('./src/tidy-var');
const tidyDeprecated = require('./src/tidy-deprecated');

/**
 * Parse rules and insert span and offset values.
 *
 * @param {Object} root The root CSS object.
 */
module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-tidy-columns',
  prepare() {
    const tidy = new TidyColumns();

    return {
      /**
       * Collect the global options.
       */
      Once(root) {
        tidy.initRoot(root, options);
      },

      /**
       * Set up rule-specific properties.
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
