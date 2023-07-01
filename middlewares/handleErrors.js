const handleErrors = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(res.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message || 'Ошибка сервера' });
  }

  next();
};

module.exports = handleErrors;
