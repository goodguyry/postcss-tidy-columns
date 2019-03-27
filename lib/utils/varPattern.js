/**
 * Pattern to match CSS Custom Properties.
 * @type {Object}
 */
const varPattern = /var\((--[\w-]+)\)/;

module.exports = varPattern;
