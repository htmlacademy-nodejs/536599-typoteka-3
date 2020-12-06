'use strict';

const {Router} = require(`express`);
const {getDefaultApi} = require(`../api`);
const {sendServerError} = require(`../helpers`);

const articles = new Router();
const api = getDefaultApi();

const pageContent = {
  title: `Типотека`,
};

const getArticleData = (body) => {
  const data = {
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    createdDate: body[`public-date`],
    сategory: [
      `Авто`,
    ],
  };

  for (const prop in data) {
    if (!data[prop]) {
      delete data[prop];
    }
  }

  return data;
};

articles.get(`/add`, (_req, res) => {
  pageContent.headerType = `search`;
  res.render(`articles/add.pug`, pageContent);
});

articles.post(`/add`, async (req, res) => {
  const {body} = req;

  const data = getArticleData(body);

  try {
    await api.createArticle(data);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

articles.get(`/edit`, (_req, res) => res.status(404).send(`Укажите id статьи`));

articles.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const article = await api.getArticle(id);

    res.render(`articles/edit.pug`, {article});
  } catch (err) {
    sendServerError(res, err);
  }
});

articles.get(`/category`, (_req, res) => {
  res.render(`404.pug`, pageContent);
});

articles.get(`/category/:id`, (_req, res) => {
  res.render(`articles/category/category-id.pug`, pageContent);
});

articles.get(`/:id`, (_req, res) => {
  pageContent.headerType = `auth`;
  res.render(`articles/article-id.pug`, pageContent);
});

module.exports = articles;
