'use strict';

const {Router} = require(`express`);
const my = new Router();

const pageContent = {
  title: `Типотека`,
  headerType: `search`,
};

my.get(`/`, (req, res) => {
  res.render(`my/my-main.pug`, pageContent);
});

my.get(`/comments`, (req, res) => {
  res.render(`my/comments.pug`, pageContent);
});

module.exports = my;
