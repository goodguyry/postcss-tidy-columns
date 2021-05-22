/**
 * Returns true for values that contain an empty or otherwise useless value.
 *
 * @param  {Mixed} values The value to be checked.
 * @return {Boolean}        Whether the value is considered empty.
 */
const hasEmptyValue = value => [null, undefined, 0, '0'].includes(value);

module.exports = hasEmptyValue;
