'use strict';

const fs = require(`fs`).promises;
const FILE_NAME = `mocks.json`;
let data = [];

const getMockData = async () => {
  if (!data.length) {
    try {
      const content = await fs.readFile(FILE_NAME);
      data = JSON.parse(content);
    } catch (err) {
      console.error(err);
    }
  }

  return data;
};

module.exports = getMockData;
