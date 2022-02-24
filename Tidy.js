const Columns = require('./Columns');
const getLocalOptions = require('./src/getLocalOptions');

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
    this.globalOptions = globalOptions;

    // Bind class methods.
    this.initRule = this.initRule.bind(this);
  }

  /**
  * Set up rule-specific properties.
  */
  initRule() {
    // Merge global and local options.
    const ruleOptions = getLocalOptions(this.rule, this.globalOptions);

    // Instantiate Columns based on the merged options.
    this.columns = new Columns(ruleOptions);
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
