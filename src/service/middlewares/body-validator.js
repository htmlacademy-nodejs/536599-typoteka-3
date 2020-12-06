'use strict';

const {HttpCode} = require(`@src/constants`);

module.exports = (keys) => (req, res, next) => {
  const {body} = req;
  const newKeys = Object.keys(body);
  const keysExist1 = keys.every((key) => newKeys.includes(key));
  console.log("keysExist1=", keysExist1)
  const keysExist2 = newKeys.every((key) => keys.includes(key));
  console.log("keysExist2=", keysExist2)
  if (!(keysExist1 && keysExist2)) {
    return res.status(HttpCode.BAD_REQUEST).send(`Invalid body properties!`);
  }

  return next();
};
