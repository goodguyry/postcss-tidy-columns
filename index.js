const Tidy = require('./Tidy');
const getGlobalOptions = require('./src/getGlobalOptions');
const { tidyFunction } = require('./tidy-function');
const { tidyVar } = require('./tidy-var');
const tidyDeprecated = require('./tidy-deprecated');

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
       * Replace tidy functions.
       */
      Declaration(declaration, { result }) {
        // Handle deprecated properties.
        tidyDeprecated(declaration, result);

        // Replace `tidy-var()` functions.
        tidyVar(declaration, tidy);

        // Replace `tidy-[span|offset]()` functions.
        tidyFunction(declaration, tidy);
      },
    };
  },
});

module.exports.postcss = true;
