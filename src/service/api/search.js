'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`@src/constants`);
const ArticleService = require(`@service/data-service/article-service`);
const routes = new Router();

const search = (appRouter, data) => {
  const services = new ArticleService(data);
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
