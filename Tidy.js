const Columns = require('./Columns');
const { getOptions } = require('./src/lib/options');

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
    const ruleOptions = getOptions(this.rule, this.globalOptions);

    // Instantiate Columns based on the merged options.
    this.columns = new Columns(ruleOptions);
  }
}

module.exports = Tidy;
