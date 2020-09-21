'use strict';

const fs = require(`fs`).promises;
const moment = require(`moment`);
const {ExitCode} = require(`@src/constant.js`);
const {getRandomInt, shuffle, print} = require(`@src/utils`);
const data = require(`./data`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 5;
const MAX_POSTS = 1000;
const FILE_NAME = `mocks.json`;

const getPostDate = () => {
  const currentDate = moment();
  const startDate = moment(currentDate).subtract(2, `M`).startOf(`M`);
  const diff = currentDate - startDate;
  const randomDiff = getRandomInt(0, diff);
  return startDate.add(randomDiff, `ms`).format(`YYYY-MM-DD hh:mm:ss`);
};

const generatePosts = (count) => {
  return Array(count).fill().map(() => {
    const fullText = shuffle(data.SENTENCES).slice(0, getRandomInt(MAX_COUNT, data.SENTENCES.length));
    return {
      title: data.TITLES[getRandomInt(1, data.TITLES.length - 1)],
      announce: fullText.slice(0, getRandomInt(1, MAX_COUNT)).join(` `),
      fullText: fullText.join(` `),
      createdDate: getPostDate(),
      сategory: shuffle(data.CATEGORIES).slice(0, getRandomInt(1, MAX_COUNT)),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {

    const [count] = args;
    const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (postsCount > MAX_POSTS) {
      print.err(`Max count posts: 1000`);
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generatePosts(postsCount));

    try {
      await fs.writeFile(FILE_NAME, content);
      return print.success(`Operation success. File created.`);
    } catch (err) {
      return print.err(`Can't write data to file...`);
    }
  }
};
