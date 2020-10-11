'use strict';

const {Router} = require(`express`);
const articles = new Router();

articles.get(`/add`, (req, res) => res.send(`${req.originalUrl}`));
articles.get(`/edit`, (req, res) => res.status(404).send(`Укажите id статьи`));
articles.get(`/edit/:id`, (req, res) => res.send(`${req.originalUrl}, id: ${req.params.id}`));
articles.get(`/category`, (req, res) => res.status(404).send(`Укажите id категории`));
articles.get(`/category/:id`, (req, res) => res.send(`${req.originalUrl}, id: ${req.params.id}`));
articles.get(`/:id`, (req, res) => res.send(`${req.originalUrl}, id: ${req.params.id}`));

module.exports = articles;
