'use strict';

const {Router} = require(`express`);
const {getDefaultApi} = require(`../api`);
const {sendServerError} = require(`../helpers`);

const my = new Router();
const api = getDefaultApi();

my.get(`/`, async (_req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`my/my-main.pug`, {articles});
  } catch (err) {
    sendServerError(res, err);
  }
});

my.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles();
  res.render(`my/comments.pug`, {articles: articles.slice(0, 3)});
});

module.exports = my;
