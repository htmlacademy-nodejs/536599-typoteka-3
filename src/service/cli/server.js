'use strict';

const express = require(`express`);
const app = express();
const fs = require(`fs`).promises;
const {print} = require(`@src/utils`);
const {HttpCode} = require(`@src/constant`);
const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;

app.use(express.json());

const onClientConnect = async (req, res) => {
  try {
    const content = await fs.readFile(FILE_NAME);
    const data = JSON.parse(content);
    res.send(data);
  } catch (err) {
    const emptyData = [];
    res.send(emptyData);
  }
};

app.get(`/posts`, onClientConnect);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`)
);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          print.err(err.message);
        }

        print.success(`Сервер ожидает подключения на порту ${port}`);
      });
    } catch (err) {
      print.err(err.message);
    }
  }
};
