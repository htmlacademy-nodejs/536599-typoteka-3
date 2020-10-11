'use strict';

const {Router} = require(`express`);
const my = new Router();

my.get(`/`, (req, res) => res.send(req.originalUrl));

my.get(`/comments`, (req, res) => res.send(req.originalUrl));

module.exports = my;
