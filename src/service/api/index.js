'use strict';

const createRoutes = async () => {
  const {Router} = require(`express`);
  const categories = require(`./categories`);
  const articles = require(`./articles`);
  const search = require(`./search`);
  const getMockData = require(`../lib/get-mock-data`);
  const appRouter = new Router();

  const mockData = await getMockData();

  categories(appRouter, mockData);
  articles(appRouter, mockData);
  search(appRouter, mockData);

  return appRouter;
};

module.exports = createRoutes;
