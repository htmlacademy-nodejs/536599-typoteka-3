'use strict';

const createServer = (express, app) => {
  const {HttpCode, API_PREFIX} = require(`@src/constants`);
  const connectRoutes = require(`@service/api/index`);

  app.use(express.json());

  app.use(API_PREFIX, connectRoutes);

  app.use((_, res) => res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found ${HttpCode.NOT_FOUND}`)
  );
};

const runServer = async (args) => {
  const express = require(`express`);
  const app = express();
  const {print} = require(`@src/utils`);

  const [customPort] = args;
  const DEFAULT_PORT = 3000;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  createServer(express, app);

  app.listen(port, (err) => {
    if (err) {
      print.err(err.message);
    }

    print.success(`Сервер ожидает подключения на http://localhost:${port}/api`);
  });
};

module.exports = {
  name: `--server`,
  run: runServer,
};
