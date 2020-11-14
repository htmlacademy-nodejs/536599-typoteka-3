'use strict';

const {Router} = require(`express`);
const categories = require(`./categories`);
const articles = require(`./articles`);
const search = require(`./search`);
const getMockData = require(`../lib/get-mock-data`);
const appRouter = new Router();

(async () => {
  const mockData = await getMockData();
  categories(appRouter, mockData);
  articles(appRouter, mockData);
  search(appRouter, mockData);
})();

module.exports = appRouter;
