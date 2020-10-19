'use strict';

const {Router} = require(`express`);
const articles = new Router();

const pageContent = {
  title: `Типотека`,
};

articles.get(`/add`, (req, res) => {
  pageContent.headerType = `search`;
  res.render(`articles/add.pug`, pageContent);
});

articles.get(`/edit`, (req, res) => res.status(404).send(`Укажите id статьи`));
articles.get(`/edit/:id`, (req, res) => res.send(`${req.originalUrl}, id: ${req.params.id}`));
articles.get(`/category`, (req, res) => {
  res.render(`404.pug`, pageContent);
});

articles.get(`/category/:id`, (req, res) => {
  res.render(`articles/category/category-id.pug`, pageContent);
});

articles.get(`/:id`, (req, res) => {
  pageContent.headerType = `auth`;
  res.render(`articles/article-id.pug`, pageContent);
});

module.exports = articles;
