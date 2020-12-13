'use strict';

const {Router} = require(`express`);
const {getDefaultApi} = require(`../api`);
const {sendServerError} = require(`../helpers`);

const routes = new Router();
const api = getDefaultApi();

const pageContent = {
  title: `Типотека`,
};

const getCategoriesWithArticleCount = (articles) => {
  const countInCategories = articles.reduce((categoryWithFrequency, article) => {
    for (let category of article.categories) {
      const currCount = categoryWithFrequency[category.name] ? categoryWithFrequency[category.name].count + 1 : 1;
      categoryWithFrequency[category.name] = {
        ...category,
        count: currCount,
      };
    }
    return categoryWithFrequency;
  }, {});
  return countInCategories;
};

routes.get(`/`, async (_req, res) => {
  try {
    const articles = await api.getArticles();
    const categories = getCategoriesWithArticleCount(articles);
    res.render(`main.pug`, {articles, categories});
  } catch (err) {
    sendServerError(res, err);
  }
});

routes.get(`/register`, (_req, res) => {
  res.render(`register.pug`, pageContent);
});

routes.get(`/login`, (_req, res) => {
  res.render(`login.pug`, pageContent);
});

routes.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search.pug`, {
      results
    });
  } catch (error) {
    res.render(`search.pug`, {
      results: []
    });
  }
  pageContent.headerType = `search`;
  res.render(`search.pug`, pageContent);
});

routes.get(`/categories`, (_req, res) => {
  pageContent.headerType = `search`;
  res.render(`categories.pug`, pageContent);
});

module.exports = routes;
