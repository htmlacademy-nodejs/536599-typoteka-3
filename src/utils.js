'use strict';

const chalk = require(`chalk`);

/**
 * Возвращает случайное число в указанном диапазоне
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Перетасовка массива
 * @param {array} someArray
 * @return {array}
 */
const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

/**
 * Выыодит в консоль раскрашенный текст
 */
const print = {
  err: (text) => console.error(chalk.red(text)),
  success: (text) => console.info(chalk.green(text)),
  info: (text) => console.info(chalk.gray(text)),
  value: (text) => console.info(chalk.blue(text)),
};

module.exports = {
  getRandomInt,
  shuffle,
  print,
};
