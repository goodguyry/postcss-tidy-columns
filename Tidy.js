const Grid = require('./Grid');
const { getLocalOptions } = require('./lib/parse-options');

/**
 * Tidy class
 * Collect rule-specific settings and properties; instantiate a new Grid instance
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
    // Instantiate Grid based on the merged options.
    this.grid = new Grid(currentOptions);
  }

  /**
  * Set up rule-specific properties.
  */
  initRule() {
    // The media query's selector to which conditional declarations will be appended.
    this.fullWidthRule = this.rule.clone({ nodes: [] });
    this.fullWidthRule.cleanRaws();

    /**
     * Test the rule for whether or not gap margin declarations should be inserted.
     *
     * Conditions for adding the gap margins
     * - The `addGap` options is `true`.
     * - There is a `tidy-span` declaration in this rule.
     * - There is not a `tidy-offset-right` declaration in this rule.
     */
    const { addGap } = this.grid.options;
    this.shouldAddGapDecl = (
      /(tidy-span:)/.test(this.rule.toString()) &&
      !/(tidy-offset-right)/.test(this.rule.toString())
    ) && addGap;
  }
}

module.exports = Tidy;
