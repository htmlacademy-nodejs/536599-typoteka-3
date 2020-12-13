'use strict';

require(`module-alias/register`);
const express = require(`express`);
const app = express();
const {print} = require(`../utils`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const port = 8080;
const PUBLIC_DIR = `./src/express/public`;

app.use(express.urlencoded({extended: false}));
app.use(express.static(PUBLIC_DIR));
app.set(`views`, `./src/express/templates`);
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(port, () => {
  print.success(`Сервер ожидает подключения на http://localhost:${port}`);
});
