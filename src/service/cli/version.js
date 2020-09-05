'use strict';

const packageJsonFile = require(`@root/package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.info(`version: ${packageJsonFile.version}`);
  },
};
