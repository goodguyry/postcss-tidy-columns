const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const hasComment = require('./lib/hasComment');

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
  const { columns, columns: { options } } = tidy;

  // Replace `tidy-span` declaration with a `width` declaration.
  if ('tidy-span' === declaration.prop) {
    /**
     * Get the span `calc()` function.
     */
    const calcValue = columns.spanCalc(declaration.value);

    const columnDecl = [];

    // Save the original declaration in a comment for debugging.
    if (
      options.debug
      && undefined !== declaration.parent
      && !hasComment(declaration)
    ) {
      declaration.cloneBefore(postcss.comment({ text: declaration.toString() }));
    }

    columnDecl.push(cleanClone(
      declaration,
      {
        prop: 'width',
        value: calcValue,
      },
    ));

    declaration.replaceWith(columnDecl);
  }

  // Replace`tidy-offset-left|right` declaration with `margin-left|right`.
  if (declaration.prop.includes('tidy-offset-')) {
    /**
     * {undefined} The full property name.
     * direction:  The side upon which the offset will be applied.
     */
    const [, direction] = declaration.prop.match(OFFSET_REGEX);

    /**
     * Get the offset `calc()` function.
     */
    const calcValue = columns.offsetCalc(declaration.value);

    // Save the original declaration in a comment for debugging.
    if (
      options.debug
      && undefined !== declaration.parent
      && !hasComment(declaration)
    ) {
      declaration.cloneBefore(postcss.comment({ text: declaration.toString() }));
    }

    // Clone the declaration with `fluid` declaration overrides.
    const fluidDecl = cleanClone(
      declaration,
      {
        prop: `margin-${direction}`,
        value: calcValue,
      },
    );

    // Replace the declaration with the cloned fluid declaration.
    declaration.replaceWith(fluidDecl);
  }
}

module.exports = {
  tidyProperty,
  OFFSET_REGEX,
};
