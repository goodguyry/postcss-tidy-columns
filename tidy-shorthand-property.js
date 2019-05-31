const postcss = require('postcss');
const cleanClone = require('./lib/cleanClone');
const cleanShorthandValues = require('./lib/cleanShorthandValues');
const hasComment = require('./lib/hasComment');

/**
 * Matches valid tidy-column shorthand values.
 *
 * @type {RegExp}
 */
const COLUMNS_REGEX = /^([\d.-]+|none)[\s/]*(span\s[\d.-]+)?[\s/]*([\d.-]+|none)?$/;

/**
 * Matches valid tidy-offset shorthand values.
 *
 * @type {RegExp}
 */
const OFFSET_REGEX = /^([\d.-]+|none)[\s/]*([\d.-]+|none)?$/;

/**
 * Replace `tidy-*` shorthand with long-form equivalents.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#column-shorthand
 *
 * @param {Object} declaration The CSS declaration.
 * @param {Object} tidy        An instance of the Tidy class.
 */
function tidyShorthandProperty(declaration, tidy) {
  const shortHandReplace = [];
  const { columns: { options } } = tidy;

  /**
   * Replace `tidy-column` shorthand, based on delcaration values.
   * - tidy-offset-left
   * - tidy-span
   * - tidy-offset-right
   */
  if ('tidy-column' === declaration.prop) {
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * span:        The `tidy-span` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, span, offsetRight] = declaration.value.match(COLUMNS_REGEX);

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({
      offsetLeft,
      span: span || offsetLeft,
      offsetRight: offsetRight || offsetLeft,
    });

    // Save the original declaration in a comment for debugging.
    if (
      options.debug
      && undefined !== declaration.parent
      && !hasComment(declaration)
    ) {
      declaration.cloneBefore(postcss.comment({ text: declaration.toString() }));
    }

    // Conditionally add the `tidy-span` property.
    if (undefined !== values.span) {
      shortHandReplace.push(cleanClone(
        declaration,
        {
          prop: 'tidy-span',
          value: values.span,
        },
      ));
    }

    // Conditionally add the `tidy-offset-left` property.
    if (undefined !== values.offsetLeft) {
      shortHandReplace.push(cleanClone(
        declaration,
        {
          prop: 'tidy-offset-left',
          value: values.offsetLeft,
        },
      ));
    }

    // Conditionally add the `tidy-offset-right` property.
    if (undefined !== values.offsetRight) {
      shortHandReplace.push(cleanClone(
        declaration,
        {
          prop: 'tidy-offset-right',
          value: values.offsetRight,
        },
      ));
    }

    // Replace the `tidy-column` shorthand property with the long-form equivalents.
    declaration.replaceWith(shortHandReplace);
  }

  /**
   * Replace `tidy-offset` shorthand, based on delcaration values.
   * - tidy-offset-left
   * - tidy-offset-right
   */
  if ('tidy-offset' === declaration.prop) {
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, offsetRight] = declaration.value.match(OFFSET_REGEX);

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({
      offsetLeft,
      offsetRight: offsetRight || offsetLeft,
    });

    // Save the original declaration in a comment for debugging.
    if (
      options.debug
      && undefined !== declaration.parent
      && !hasComment(declaration)
    ) {
      declaration.cloneBefore(postcss.comment({ text: declaration.toString() }));
    }

    // Conditionally add the `tidy-offset-left` property.
    if (undefined !== values.offsetLeft) {
      shortHandReplace.push(cleanClone(
        declaration,
        {
          prop: 'tidy-offset-left',
          value: values.offsetLeft,
        },
      ));
    }

    // Conditionally add the `tidy-offset-right` property.
    if (undefined !== values.offsetRight) {
      shortHandReplace.push(cleanClone(
        declaration,
        {
          prop: 'tidy-offset-right',
          value: values.offsetRight,
        },
      ));
    }

    // Replace the `tidy-offset` shorthand property with the long-form equivalents.
    declaration.replaceWith(shortHandReplace);
  }
}

module.exports = {
  tidyShorthandProperty,
  COLUMNS_REGEX,
  OFFSET_REGEX,
};
