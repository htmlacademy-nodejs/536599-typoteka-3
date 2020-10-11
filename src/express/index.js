'use strict';

const express = require(`express`);
const app = express();
const routes = require(`./routes`);
const articles = require(`./routes/articles`);
const my = require(`./routes/my`);
const port = 8080;

app.use(`/`, routes);
app.use(`/my`, my);
app.use(`/articles`, articles);

app.listen(port);
