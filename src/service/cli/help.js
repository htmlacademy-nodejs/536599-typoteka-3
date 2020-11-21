'use strict';

const run = () => {
  const {print} = require(`@src/utils`);
  const text = `
    Программа запускает http-сервер и формирует файл с данными для API.
    
    Гайд:
    service.js <command>
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mocks.json
    --server:             запуск сервера
  `;

  print.info(text);
};

module.exports = {
  name: `--help`,
  run,
};
