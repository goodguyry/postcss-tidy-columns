const postcss = require('postcss');
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
    this.collectBreakpointAtRules = this.collectBreakpointAtRules.bind(this);

    // Merge global and local options.
    const currentOptions = getLocalOptions(this.rule, globalOptions);

    // Remove the `breakpoint` property that results from merging in the breakpoint config.
    if (Object.prototype.hasOwnProperty.call(currentOptions, 'breakpoint')) {
      delete currentOptions.breakpoint;
    }

    // Create and store an atRule for each breakpoint in the config.
    this.atRules = this.collectBreakpointAtRules(currentOptions);

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
   * Create breakpoint atRules for later use.
   *
   * @param  {Object} options The current config options.
   * @return {Array}         An array of breakpoint atRules.
   */
  collectBreakpointAtRules(options) {
    const { breakpoints } = options;

    return Object.keys(breakpoints).map(breakpoint => (
      // Create the atRule.
      postcss.atRule({
        name: 'media',
        params: `(min-width: ${breakpoint})`,
        nodes: [],
        source: this.rule.source,
      })
    ));
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
