'use strict';

const categories = (appRouter, service) => {
  const {Router} = require(`express`);

  const routes = new Router();

  appRouter.use(`/categories`, routes);

  routes.get(`/`, (req, res) => res.send(service.findAll()));
};

module.exports = categories;
