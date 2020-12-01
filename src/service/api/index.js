'use strict';
const createRoutes = async () => {
  const {Router} = require(`express`);
  const categories = require(`./categories`);
  const articles = require(`./articles`);
  const search = require(`./search`);
  const getMockData = require(`../lib/get-mock-data`);
  const ArticleService = require(`@service/data-service/article-service`);
  const CategoryService = require(`@service/data-service/category-service`);

  const appRouter = new Router();

  const mockData = await getMockData();
  const articleService = new ArticleService(mockData);
  const сategoryService = new CategoryService(mockData);

  categories(appRouter, сategoryService);
  articles(appRouter, articleService);
  search(appRouter, articleService);

  return appRouter;
};

module.exports = createRoutes;
