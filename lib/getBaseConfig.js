const presets = require('./presets');

module.exports = (commandName) => {
  if (presets[commandName] === undefined) {
    throw new Error(`openedx: ${commandName} is unsupported in this version`);
  }

  return presets[commandName].getDefault();
};
