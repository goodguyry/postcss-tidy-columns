const Columns = require('./Columns');
const getLocalOptions = require('./src/getLocalOptions');
const cleanClone = require('./lib/cleanClone');

/**
 * Tidy class
 * Collect rule-specific settings and properties; instantiate a new Columns instance.
 *
 * @param {Object} rule          The current CSS rule.
 * @param {Object} globalOptions The global plugin options.
 */
class Tidy {
  constructor(rule, globalOptions) {
    this.rule = rule;

    // Bind class methods.
    this.initRule = this.initRule.bind(this);

    // Merge global and local options.
    const currentOptions = getLocalOptions(this.rule, globalOptions);

    // Remove the `breakpoint` property that results from merging in the breakpoint config.
    if (Object.prototype.hasOwnProperty.call(currentOptions, 'breakpoint')) {
      delete currentOptions.breakpoint;
    }

    // Instantiate Columns based on the merged options.
    this.columns = new Columns(currentOptions);
  }

  /**
  * Set up rule-specific properties.
  */
  initRule() {
    // The media query's selector to which conditional declarations will be appended.
    this.fullWidthRule = cleanClone(this.rule);
  }

  /**
   * Save the declaration's source value for use in other scripts.
   *
   * @param {Object} decl The current declaration.
   */
  captureDeclarationSource(decl) {
    this.declarationSource = decl.source;
  }
}

module.exports = Tidy;
