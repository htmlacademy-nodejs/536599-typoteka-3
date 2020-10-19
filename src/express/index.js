'use strict';

const express = require(`express`);
const app = express();
const {print} = require(`../utils`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const port = 8080;
const PUBLIC_DIR = `./src/express/public`;

app.use(express.static(PUBLIC_DIR));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.listen(port, () => {
  print.success(`Сервер ожидает подключения на порту ${port}`);
});
