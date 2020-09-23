'use strict';

const fs = require(`fs`).promises;
const moment = require(`moment`);
const {ExitCode} = require(`@src/constant.js`);
const {getRandomInt, shuffle, print} = require(`@src/utils`);


const DEFAULT_COUNT = 1;
const MAX_COUNT = 5;
const MAX_POSTS = 1000;
const FILE_NAME = `mocks.json`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_TITLES = `./data/titles.txt`;

const getPostDate = () => {
  const currentDate = moment();
  const startDate = moment(currentDate).subtract(2, `M`).startOf(`M`);
  const diff = currentDate - startDate;
  const randomDiff = getRandomInt(0, diff);
  return startDate.add(randomDiff, `ms`).format(`YYYY-MM-DD hh:mm:ss`);
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    print.err(err);
    return [];
  }
};

const writeDataToFile = async (content) => {
  try {
    await fs.writeFile(FILE_NAME, content);
    return print.success(`Operation success. File created.`);
  } catch (err) {
    return print.err(err);
  }
};

const generatePosts = async (count) => {
  const sentences = await readContent(FILE_PATH_SENTENCES);
  const categories = await readContent(FILE_PATH_CATEGORIES);
  const titles = await readContent(FILE_PATH_TITLES);
  return Array(count).fill().map(() => {
    const fullText = shuffle(sentences).slice(0, getRandomInt(MAX_COUNT, sentences.length));
    return {
      title: titles[getRandomInt(1, titles.length - 1)],
      announce: fullText.slice(0, getRandomInt(1, MAX_COUNT)).join(` `),
      fullText: fullText.join(` `),
      createdDate: getPostDate(),
      сategory: shuffle(categories).slice(0, getRandomInt(1, MAX_COUNT)),
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

    const content = JSON.stringify(await generatePosts(postsCount));

    writeDataToFile(content);
  }
};
