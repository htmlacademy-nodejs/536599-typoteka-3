'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const {print} = require(`@src/utils`);
const {HttpCode} = require(`@src/constant`);
const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-type': `text/html; charset=utf-8`,
  });
  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found!`;

  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(FILE_NAME);
        const data = JSON.parse(content);
        const items = data.map(({title}) => `<li>${title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${items}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      if (err) {
        print.err(`Ошибка при создании сервера ${err}`);
      }
      print.success(`Ожидаю соединений на ${port}`);
    });
  }
};
