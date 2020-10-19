'use strict';

const {Router} = require(`express`);
const routes = new Router();

const pageContent = {
  title: `Типотека`,
};

routes.get(`/`, (req, res) => {
  res.render(`main.pug`, pageContent);
});

routes.get(`/register`, (req, res) => {
  res.render(`register.pug`, pageContent);
});

routes.get(`/login`, (req, res) => {
  res.render(`login.pug`, pageContent);
});

routes.get(`/search`, (req, res) => {
  pageContent.headerType = `search`;
  res.render(`search.pug`, pageContent);
});

routes.get(`/categories`, (req, res) => {
  pageContent.headerType = `search`;
  res.render(`categories.pug`, pageContent);
});

module.exports = routes;
