'use strict';

const {Router} = require(`express`);
const routes = new Router();

routes.get(`/`, (req, res) => res.send(`/`));
routes.get(`/register`, (req, res) => res.send(req.originalUrl));
routes.get(`/login`, (req, res) => res.send(req.originalUrl));
routes.get(`/search`, (req, res) => res.send(req.originalUrl));
routes.get(`/categories`, (req, res) => res.send(req.originalUrl));

module.exports = routes;
