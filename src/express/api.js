'use strict';

const axios = require(`axios`);
const {API_PREFIX} = require(`@src/constants`);

class Api {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const resp = await this._http.request({
      url,
      ...options,
    });
    return resp.data;
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories() {
    return this._load(`/categories`);
  }

  getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }
}

const getDefaultApi = () => {
  const TIMEOUT = 1000;
  const port = process.env.API_PORT || 3000;
  const baseURL = `http://localhost:${port}${API_PREFIX}/`;
  const defaultApi = new Api(baseURL, TIMEOUT);
  return defaultApi;
};

module.exports = {
  Api,
  getDefaultApi,
};
