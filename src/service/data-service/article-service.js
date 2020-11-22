'use strict';

const {MAX_ID_LENGTH} = require(`@src/constants`);
const {nanoid} = require(`nanoid`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...article,
    };

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(article) {
    this._articles = this._articles.filter((item) => item !== article);
    return article;
  }

  update(currArticle, newProps) {
    return Object.assign(currArticle, newProps);
  }

  findAll() {
    return this._articles || [];
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  findByTitle(searchText) {
    return this._articles.
      filter((offer) => {
        return offer.title.toLowerCase().includes(searchText.toLowerCase());
      });
  }

  createComment(article, data) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      ...data,
    };

    article.comments.push(newComment);
    return newComment;
  }

  deleteComment(article, commentId) {
    const dropComment = article.comments
      .find((item) => item.id === commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments
      .filter((item) => item.id !== commentId);

    return dropComment;
  }
}

module.exports = ArticleService;
