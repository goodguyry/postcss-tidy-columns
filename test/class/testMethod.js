/**
 * Test a class method.
 *
 * @param {Object} testConfig              A test suite.
 * @param {String} testConfig.description  The test suite description.
 * @param {Array}  testConfig.tests        An array of Test Objects
 * @param {String} test.description        The test description.
 * @param {String} test.actual             The test's plugin output.
 * @param {String} test.expected           The expected plugin output.
 */
const testMethod = (testConfig) => {
  describe(testConfig.description, () => {
    testConfig.tests.forEach((unitTest) => {
      test(unitTest.description, () => {
        expect(unitTest.actual).toEqual(unitTest.expected);
      });
    });
  });
};

module.exports = testMethod;
