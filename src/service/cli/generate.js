'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {ExitCode, MAX_ID_LENGTH} = require(`@src/constants.js`);
const {getRandomInt, shuffle, print} = require(`@src/utils`);

const DEFAULT_COUNT = 1;
const MAX_POSTS = 1000;
const MAX_ANNOUNCE_SIZE = 5;
const MAX_CATEGORIES_COUNT = 5;
const MAX_COMMENTS_COUNT = 5;
const MAX_COMMENT_SIZE = 5;
const FILE_NAME = `mocks.json`;
const FILE_PATH_CATEGORIES = `./data/categories.txt`;
const FILE_PATH_SENTENCES = `./data/sentences.txt`;
const FILE_PATH_TITLES = `./data/titles.txt`;
const FILE_PATH_COMMENTS = `./data/comments.txt`;

const run = async (args) => {
  const [count] = args;
  const postsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
  if (postsCount > MAX_POSTS) {
    print.err(`Max count posts: 1000`);
    process.exit(ExitCode.ERROR);
  }

  const content = JSON.stringify(await generatePosts(postsCount));

  writeDataToFile(content);
};

const getPostDate = () => {
  const moment = require(`moment`);
  const currentDate = moment();
  const startDate = moment(currentDate).subtract(2, `M`).startOf(`M`);
  const diff = currentDate - startDate;
  const randomDiff = getRandomInt(0, diff);
  return startDate.add(randomDiff, `ms`).format(`YYYY-MM-DDThh:mm:ss`);
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

const getText = (data, count) => {
  return shuffle(data).slice(0, count);
};

const generateComments = (comments) => {
  const commentsCount = getRandomInt(1, MAX_COMMENTS_COUNT);
  const commentSize = getRandomInt(1, MAX_COMMENT_SIZE);
  return Array(commentsCount).fill().map(() => {
    return {
      id: nanoid(MAX_ID_LENGTH),
      text: getText(comments, commentSize).join(` `)
    };
  });
};

const generateCategories = (categories) => {
  const randomCategories = shuffle(categories).slice(0, getRandomInt(1, MAX_CATEGORIES_COUNT));
  return randomCategories.map((categoryName) => {
    return {
      id: nanoid(MAX_ID_LENGTH),
      name: categoryName,
    };
  });
};

const generatePosts = async (count) => {
  const sentences = await readContent(FILE_PATH_SENTENCES);
  const categories = await readContent(FILE_PATH_CATEGORIES);
  const titles = await readContent(FILE_PATH_TITLES);
  const comments = await readContent(FILE_PATH_COMMENTS);

  return Array(count).fill().map(() => {
    const textSize = getRandomInt(MAX_ANNOUNCE_SIZE, sentences.length);
    const announceSize = getRandomInt(1, MAX_ANNOUNCE_SIZE);
    const fullText = getText(sentences, textSize);
    return {
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(1, titles.length - 1)],
      announce: fullText.slice(0, announceSize).join(` `),
      fullText: fullText.join(` `),
      createdDate: getPostDate(),
      categories: generateCategories(categories),
      comments: generateComments(comments),
    };
  });
};

module.exports = {
  name: `--generate`,
  run,
};
