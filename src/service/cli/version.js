'use strict';

const packageJsonFile = require(`@root/package.json`);
const {print} = require(`@src/utils`);

module.exports = {
  name: `--version`,
  run() {
    print.value(`version: ${packageJsonFile.version}`);
  },
};
