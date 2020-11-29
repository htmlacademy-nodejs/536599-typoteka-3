'use strict';

const search = (appRouter, services) => {
  const {Router} = require(`express`);
  const {HttpCode} = require(`@src/constants`);
  const routes = new Router();

  appRouter.use(`/search`, routes);

  routes.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = services.findByTitle(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .send(searchResults);
  });
};

module.exports = search;
