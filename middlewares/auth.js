const jwt = require('jsonwebtoken');
const {
  ERROR_401,
} = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
