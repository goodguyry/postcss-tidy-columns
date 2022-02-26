const valueParser = require('postcss-value-parser');
const reducer = require('postcss-calc/dist/lib/reducer');
const { parser } = require('postcss-calc/dist/parser');
const { roundToPrecision } = require('./values');

/**
 * Stringify the reduced AST.
 * Source: postcss-calc/src/lib/stringifier.js
 *
 * @param  {Object} node The current node.
 * @return {String}
 */
function stringify(node) {
  const { type, value, unit } = node;
  const order = {
    '*': 0,
    '/': 0,
    '+': 1,
    '-': 1,
  };

  switch (type) {
    case 'MathExpression': {
      const { left, right, operator: op } = node;
      let str = '';

      if ('MathExpression' === left.type && order[op] < order[left.operator]) {
        str += `(${stringify(left)})`;
      } else {
        str += stringify(left);
      }

      str += order[op] ? ` ${node.operator} ` : node.operator;

      if ('MathExpression' === right.type && order[op] < order[right.operator]) {
        str += `(${stringify(right)})`;
      } else {
        str += stringify(right);
      }

      return str;
    }
    case 'Number':
      return roundToPrecision(value);
    case 'Function':
      return value;
    default:
      return `${roundToPrecision(value)}${unit}`;
  }
}

/**
 * Transform a property value.
 * Source: postcss-calc/src/lib/transform.js
 *
 * @param  {string} value The node property value.
 * @return {string}
 */
module.exports = function transformValue(value, supressCalc = false) {
  return valueParser(value).walk((node) => {
    // Return early if it's not a function.
    if (node.type !== 'function') {
      return node;
    }

    // Stringify the function expression.
    const contents = valueParser.stringify(node.nodes);
    // Get the AST.
    const ast = parser.parse(contents);
    // Reduce the AST.
    const reducedAst = reducer(ast);

    // Stringify the AST
    let newValue = stringify(reducedAst);

    // If it's a MathExpression, wrap it in `()`.
    if ('MathExpression' === reducedAst.type) {
      // We may or may not want the `calc` function.
      newValue = `${supressCalc ? '' : 'calc'}(${newValue})`;
    }

    // Write the node back.
    Object.assign(node, { type: 'word', value: newValue });

    return false;
  }).toString();
};
