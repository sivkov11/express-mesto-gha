const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDM2OWJjZmU0NzAwOGJhYmJmOTc3Y2IiLCJpYXQiOjE2ODEzMDA0NDUsImV4cCI6MTY4MTkwNTI0NX0.p1RozlX8_j5rXTb2Ck7KZKE-PJvKqYSgvxiamRmHvV0';

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
