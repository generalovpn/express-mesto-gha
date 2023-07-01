const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Просьба авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'unique-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Просьба авторизоваться');
  }
  req.user = payload;

  next();
};

module.exports = auth;
