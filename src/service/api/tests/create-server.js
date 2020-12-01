'use strict';
const express = require(`express`);

const createServer = (routs, mockData) => {
  const app = express();
  app.use(express.json());
  routs(app, mockData);

  return app;
};

module.exports = createServer;
