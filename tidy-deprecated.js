const cleanClone = require('./lib/cleanClone');

/**
 * Returns a formatted deprecation notice.
 *
 * @param  {string} old     The deprecated property.
 * @param  {string} current The suggested update.
 * @return {string}         The deprecation notice and suggetsted fix.
 */
const getDeprecatedMessage = (old, current) => (`

Deprecated: \`${old}\` will be removed in a future version.
> Use \`${current}\` instead

`);

/**
 * Clean and trim shorthand property values.
 * Remove slashes, spaces, and invalid/unneeded values.
 *
 * @param {Object} values An object of matched shorthand property values.
 */
function cleanShorthandValues(values) {
  const properties = Object.keys(values)
    .reduce((acc, key) => {
      const value = values[key];

      if (undefined !== value) {
        const cleanValue = value.replace(/\/|span/g, '').trim();

        // Zero and `none` values are skipped.
        if (0 !== Number(cleanValue, 10) && 'none' !== cleanValue) {
          acc[key] = cleanValue;
        }
      }

      return acc;
    }, {});

  return properties;
}

/**
 * Warn and replace deprecated properties.
 *
 * @param {Object} declaration The current CSS declaration.
 * @param {Result} result      Provides the result of the PostCSS transformations.
 */
function tidyDeprecated(declaration, result) {
  const suggestions = [];

  /**
   * Instances of `tidy-column` should be replaced with `margin-left`, `width`,
   * and `margin-right`, using the `tidy-span()` and `tidy-offset()` functions.
   *
   * Ex: tidy-column: <left-offset> / <span> / <right-offset>
   *
   * Becomes:
   * > margin-left: tidy-offset(<left-offset>)
   * > width: tidy-span(<span>)
   * > margin-right: tidy-offset(<right-offset>)
   */
  if ('tidy-column' === declaration.prop) {
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * span:        The `tidy-span` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, span, offsetRight] = declaration.value.match(
      /^([\d.-]+|none)[\s/]*(span\s[\d.-]+)?[\s/]*([\d.-]+|none)?$/,
    );

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({
      offsetLeft,
      span: span || offsetLeft,
      offsetRight: offsetRight || offsetLeft,
    });

    if (undefined !== values.span) {
      suggestions.push({ prop: 'width', value: `tidy-span(${values.span})` });
    }

    if (undefined !== values.offsetLeft) {
      suggestions.push({ prop: 'margin-left', value: `tidy-offset(${values.offsetLeft})` });
    }

    if (undefined !== values.offsetRight) {
      suggestions.push({ prop: 'margin-right', value: `tidy-offset(${values.offsetRight})` });
    }
  }

  /**
   * Instances of `tidy-offset` should be replaced with `margin-left` and
   * `margin-right`, using the `tidy-offset()` function.
   *
   * Ex: tidy-offset: <left-offset> / <right-offset>
   *
   * Becomes:
   * > margin-left: tidy-offset(<left-offset>)
   * > margin-right: tidy-offset(<right-offset>)
   */
  if ('tidy-offset' === declaration.prop) {
    /**
     * {undefined}  The full declaration value.
     * offsetLeft:  The `tidy-offset-left` value.
     * offsetRight: The `tidy-offset-right` value.
     */
    const [, offsetLeft, offsetRight] = declaration.value.match(
      /^([\d.-]+|none)[\s/]*([\d.-]+|none)?$/,
    );

    // Remove slashes, spaces, and invalid/unneeded values.
    const values = cleanShorthandValues({
      offsetLeft,
      offsetRight: offsetRight || offsetLeft,
    });

    if (undefined !== values.offsetLeft) {
      suggestions.push({ prop: 'margin-left', value: `tidy-offset(${values.offsetLeft})` });
    }

    if (undefined !== values.offsetRight) {
      suggestions.push({ prop: 'margin-right', value: `tidy-offset(${values.offsetRight})` });
    }
  }

  /**
   * Instances of `tidy-span` should be replaced with `width` using the
   * tidy-span() function.
   *
   * Ex: tidy-span: <span>
   *
   * Becomes:
   * > width: tidy-span(<span>)
   */
  if ('tidy-span' === declaration.prop) {
    suggestions.push({ prop: 'width', value: `tidy-span(${declaration.value})` });
  }

  /**
   * Instances of `tidy-offset-left` and `tidy-offset-right` should be replaced
   * with `margin-left` and `margin-right`, using the tidy-offset() function.
   *
   * Ex: tidy-offset-left: <offset>
   *
   * Becomes:
   * > margin-left: tidy-offset(<left-offset>)
   *
   * Ex: tidy-offset-right: <offset>
   *
   * Becomes:
   * > margin-right: tidy-offset(<right-offset>)
   */
  if (declaration.prop.includes('tidy-offset-')) {
    /**
     * {undefined} The full property name.
     * direction:  The side upon which the offset will be applied.
     */
    const [, direction] = declaration.prop.match(/tidy-offset-(left|right)/);

    suggestions.push({ prop: `margin-${direction}`, value: `tidy-offset(${declaration.value})` });
  }

  // Warn of deprecated properties and suggest changes.
  const replacements = suggestions.map((suggestion) => {
    const { prop, value } = suggestion;

    result.warn(
      getDeprecatedMessage(declaration.prop, `${prop}: ${value}`),
      {
        node: declaration,
        word: declaration.prop,
      },
    );

    return cleanClone(declaration, { prop, value });
  });

  if (replacements.length > 0) {
    // Replace the deprecated declaration with the suggestion(s) from the deprecation notice.
    declaration.replaceWith(replacements);
  }
}

module.exports = tidyDeprecated;
