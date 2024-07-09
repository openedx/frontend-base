const { createConfig } = require('../..');

module.exports = createConfig('jest', {
  // This testEnvironment is important - our default Jest configuration sets the testEnvironment to
  // 'jsdom' - this does not work for tests that rely on node features, such as those for
  // HtmlWebpackNewRelicPlugin.
  testEnvironment: 'node',
});
