'use strict';

const {HttpCode} = require(`@src/constants`);

module.exports = (keys) => (req, res, next) => {
  const {body} = req;
  const newKeys = Object.keys(body);
  const keysExist1 = keys.every((key) => newKeys.includes(key));
  const keysExist2 = newKeys.every((key) => keys.includes(key));
  if (!(keysExist1 && keysExist2)) {
    return res.status(HttpCode.BAD_REQUEST).send(`Invalid body properties!`);
  }

  return next();
};
