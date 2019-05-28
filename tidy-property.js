const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');

/**
 * Pattern to match the `tidy-offset-*` property.
 *
 * @type {RegExp}
 */
const OFFSET_REGEX = /tidy-offset-(left|right)/;

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
function tidyProperty(declaration, tidy) {
  const { fullWidthRule, columns, columns: { options } } = tidy;

  // Replace `tidy-span` declaration with a `width` declaration.
  if ('tidy-span' === declaration.prop) {
    /**
     * fluid: calc() function based on 100vw base.
     * full:  calc() function based on `siteMax` base.
     */
    const { fluid, full } = columns.spanCalc(declaration.value);

    const columnDecl = [];

    // Save the original declaration in a comment for debugging.
    if (options.debug) {
      declaration.cloneBefore(postcss.comment({ text: declaration }));
    }

    columnDecl.push(cleanClone(
      declaration,
      {
        prop: 'width',
        value: fluid,
      },
    ));

    // Conditionally insert a `max-width` declaration.
    if (undefined !== full) {
      columnDecl.push(cleanClone(
        declaration,
        {
          prop: 'max-width',
          value: full,
        },
      ));
    }

    declaration.replaceWith(columnDecl);
  }

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
    const { fluid, full } = columns.offsetCalc(declaration.value);

    // Save the original declaration in a comment for debugging.
    if (options.debug) {
      declaration.cloneBefore(postcss.comment({ text: declaration }));
    }

    // Clone the declaration with `fluid` declaration overrides.
    const fluidDecl = cleanClone(
      declaration,
      {
        prop: `margin-${direction}`,
        value: fluid,
      },
    );

    // Replace the declaration with the cloned fluid declaration.
    declaration.replaceWith(fluidDecl);

    // Conditionally add a `margin-[left|right]` declaration to the media query.
    if (undefined !== full && 'rule' === fullWidthRule.type) {
      // Clone the declaration with `full` declaration overrides.
      fullWidthRule.append(cleanClone(
        declaration,
        {
          prop: `margin-${direction}`,
          value: full,
        },
      ));
    }
  }
}

module.exports = {
  tidyProperty,
  OFFSET_REGEX,
};
