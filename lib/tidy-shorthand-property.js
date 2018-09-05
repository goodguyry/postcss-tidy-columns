const postcss = require('postcss');

/**
 * Clean and trim shorthand property values.
 * Remove slashes, spaces, and invalid/unneeded values.
 *
 * @param {Object} values An object of matched shorthand property values.
 *
 * @returns {Object}
 */
function cleanShorthandValues(values) {
  const properties = Object.keys(values)
    .reduce((acc, key) => {
      const value = values[key];

      if (undefined !== value) {
        const cleanValue = value.replace(/\/|span/g, '').trim();

        // Zero and `inherit` values are skipped.
        if (0 !== Number(cleanValue, 10) && 'inherit' !== cleanValue) {
          acc[key] = cleanValue;
        }
      }

      return acc;
    }, {});

  return properties;
}

/**
 * Replace `tidy-*` shorthand with long-form equivalents.
 *
 * @see https://github.com/goodguyry/postcss-tidy-columns#column-shorthand
 *
 * @param {Object} declaration The CSS declaration.
 */
module.exports = function tidyShorthandProperty(declaration) {
  const shortHandReplace = [];

  /**
   * Replace `tidy-column` shorthand, based on delcaration values.
   * - tidy-offset-left
   * - tidy-span
   * - tidy-offset-right
   */
  if ('tidy-column' === declaration.prop) {
    const COLUMNS_REGEX = /^([\d.-]+|inherit)\s?(\/\s?span\s[\d.-]+)\s?(\/\s?[\d.-]+)?$/;
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * span:        The `tidy-span` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, span, offsetRight] = declaration.value.match(COLUMNS_REGEX);

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({ offsetLeft, span, offsetRight });

    if (undefined !== values.span) {
      shortHandReplace.push(postcss.decl({
        prop: 'tidy-span',
        value: values.span,
        source: declaration.source,
      }));
    }

    if (undefined !== values.offsetLeft) {
      shortHandReplace.push(postcss.decl({
        prop: 'tidy-offset-left',
        value: values.offsetLeft,
        source: declaration.source,
      }));
    }

    if (undefined !== values.offsetRight) {
      shortHandReplace.push(postcss.decl({
        prop: 'tidy-offset-left',
        value: values.offsetRight,
        source: declaration.source,
      }));
    }

    declaration.replaceWith(shortHandReplace);
  }

  /**
   * Replace `tidy-offset` shorthand, based on delcaration values.
   * - tidy-offset-left
   * - tidy-offset-right
   */
  if ('tidy-offset' === declaration.prop) {
    const OFFSET_REGEX = /^(\d+|inherit)\s?(\/\s?\d+)?$/;
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, offsetRight] = declaration.value.match(OFFSET_REGEX);

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({ offsetLeft, offsetRight });

    if (undefined !== values.offsetLeft) {
      shortHandReplace.push(postcss.decl({
        prop: 'tidy-offset-left',
        value: values.offsetLeft,
        source: declaration.source,
      }));
    }

    if (undefined !== values.offsetRight) {
      shortHandReplace.push(postcss.decl({
        prop: 'tidy-offset-right',
        value: values.offsetRight,
        source: declaration.source,
      }));
    }

    declaration.replaceWith(shortHandReplace);
  }
};
