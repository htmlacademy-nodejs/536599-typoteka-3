'use strict';

const {getLogger} = require(`@service/lib/logger`);
const logger = getLogger({name: `front`});
const {HttpCode} = require(`@src/constants`);

/**
 * Отправляет пользователю ответ код 500. Логирует ошибку.
 * @param {object} resp - объект ответа
 * @param {object} err - объект ошибки
 * @return {void}
 */
const sendServerError = (resp, err) => {
  logger.error(err.message);
  resp
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(`INTERNAL_SERVER_ERROR: 500!`);
};

module.exports = {
  sendServerError,
};
