const postcss = require('postcss');

/**
 * Replace `tidy-*` properties.
 * - tidy-span
 * - tidy-offset-left
 * - tidy-offset-right
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#span
 * @see https://github.com/goodguyry/postcss-tidy-columns#offset-left
 * @see https://github.com/goodguyry/postcss-tidy-columns#offset-right
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Object} tidy        An instance of the Tidy class.
 */
module.exports = function tidyProperty(declaration, tidy) {
  const { fullWidthRule, shouldAddGapDecl, grid } = tidy;

  // Replace `tidy-span` declaration with a `width` declaration.
  if ('tidy-span' === declaration.prop) {
    /**
     * fluid: calc() function based on 100vw base.
     * full:  calc() function based on `siteMax` base.
     */
    const { fluid, full } = grid.spanCalc(declaration.value);

    const columnDecl = [];

    columnDecl.push(declaration.clone({
      prop: 'width',
      value: fluid,
    }));

    // Conditionally insert a `max-width` declaration.
    if (undefined !== full) {
      columnDecl.push(postcss.decl({
        prop: 'max-width',
        value: full,
        source: declaration.source,
      }));
    }

    // Conditionally insert a gap margin.
    if (shouldAddGapDecl) {
      columnDecl.push(postcss.decl({
        prop: 'margin-right',
        value: grid.options.gap,
        source: declaration.source,
      }));
    }

    declaration.replaceWith(columnDecl);
  }

  const OFFSET_REGEX = /tidy-offset-(left|right)/;

  // Replace`tidy-offset-left|right` declaration with `margin-left|right`.
  if (OFFSET_REGEX.test(declaration.prop)) {
    /**
     * {undefined} The full property name.
     * direction:  The side upon which the offset will be applied.
     */
    const [, direction] = declaration.prop.match(OFFSET_REGEX);
    /**
     * fluid: calc() function based on 100vw base.
     * full:  calc() function based on `siteMax` base.
     */
    const { fluid, full } = grid.offsetCalc(declaration.value);

    declaration
      .cloneBefore()
      .replaceWith(postcss.decl({
        prop: `margin-${direction}`,
        value: fluid,
      }));

    // Conditionally add a`margin-left` to the media query.
    if (undefined !== full) {
      const fullDecl = postcss.decl({
        prop: `margin-${direction}`,
        value: full,
        source: declaration.source,
      });

      if ('rule' === fullWidthRule.type) {
        // Normal rule.
        fullWidthRule.append(fullDecl);
      }
    }

    declaration.remove();
  }
};
