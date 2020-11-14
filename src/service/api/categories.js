'use strict';

const {Router} = require(`express`);
const CategoryService = require(`@service/data-service/category-service`);

const routes = new Router();

const categories = (appRouter, data) => {
  const service = new CategoryService(data);

  appRouter.use(`/categories`, routes);

  routes.get(`/`, (req, res) => res.send(service.findAll()));
};

module.exports = categories;
