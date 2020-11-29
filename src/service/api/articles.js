'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`@src/constants`);
const bodyValidator = require(`@service/middlewares/body-validator.js`);
const articleExist = require(`@service/middlewares/article-exist.js`);
const COMMENT_KEYS = [`text`];
const ARTICLE_KEYS = [`title`, `announce`, `fullText`, `createdDate`, `сategory`];

const articles = (appRouter, services) => {
  const routes = new Router();

  appRouter.use(`/articles`, routes);

  routes.get(`/`, (_, res) => res.send(services.findAll()));

  routes.post(`/`, bodyValidator(ARTICLE_KEYS), (req, res) => {
    const newArticleData = req.body;
    const article = services.create(newArticleData);

    res.status(HttpCode.CREATED).json(article);
  });

  routes.get(`/:articleId`, articleExist(services), (req, res) => {
    const {article} = res.locals;
    res.send(article);
  });

  routes.put(`/:articleId`, [articleExist(services), bodyValidator(ARTICLE_KEYS)], (req, res) => {
    const {article} = res.locals;
    const updatedArticle = services.update(article, req.body);

    res.status(HttpCode.OK)
      .send(updatedArticle);
  });

  routes.delete(`/:articleId`, articleExist(services), (_, res) => {
    const {article} = res.locals;
    const dropArticle = services.drop(article);
    res.status(HttpCode.OK)
      .send(dropArticle);
  });

  routes.get(`/:articleId/comments`, articleExist(services), (_, res) => {
    const {article} = res.locals;
    res.send(article.comments || []);
  });

  routes.post(`/:articleId/comments`, [articleExist(services), bodyValidator(COMMENT_KEYS)], (req, res) => {
    const {article} = res.locals;
    const comment = services.createComment(article, req.body);

    return res.status(HttpCode.CREATED)
      .send(comment);
  });

  routes.delete(`/:articleId/comments/:commentId`, articleExist(services), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = services.deleteComment(article, commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
    return res.status(HttpCode.OK)
      .send(deletedComment);
  });
};

module.exports = articles;
