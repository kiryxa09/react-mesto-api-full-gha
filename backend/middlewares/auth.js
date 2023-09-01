const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnAuthError = require('../errors/unauth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new UnAuthError('Необходима авторизация');
};

module.exports = (req, res, next) => {
  const token = req.cookies;
  console.log(req);

  if (!token) {
    return handleAuthError(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return true;
};
