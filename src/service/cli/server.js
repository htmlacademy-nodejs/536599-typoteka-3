'use strict';
const {getLogger} = require(`@service/lib/logger`);
const logger = getLogger({name: `api`});

const createServer = async (express, app) => {
  const {HttpCode, API_PREFIX} = require(`@src/constants`);
  const createRoutes = require(`@service/api/index`);
  const appRouter = await createRoutes();

  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Request on route: ${req.url}`);
    res.on(`finish`, () => {
      logger.debug(`Response status code ${res.statusCode}`);
    });
    next();
  });

  app.use(API_PREFIX, appRouter);

  app.use((req, res) => {
    res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found ${HttpCode.NOT_FOUND}`);
    logger.error(`Route not fount ${req.url}`);
  });

  app.use((err, _req, _res, _next) => {
    logger.error(`An error occured on processing request: ${err.message}`);
  });
};

const runServer = async (args) => {
  const express = require(`express`);
  const app = express();

  const [customPort] = args;
  const DEFAULT_PORT = 3000;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  await createServer(express, app);

  app.listen(port, (err) => {
    if (err) {
      logger.error(`An error occured on server creation: ${err.message}`);
    }

    logger.info(`Listening to connections on: http://localhost:${port}/api`);
  });
};

module.exports = {
  name: `--server`,
  run: runServer,
};
