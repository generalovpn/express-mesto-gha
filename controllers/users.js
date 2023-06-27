const http2 = require('http2');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res.status(http2.constants.STATUS_OK).send(users))
    .catch(() => {
      res.status(http2.constants.STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(http2.constants.STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(http2.constants.STATUS_BAD_REQUEST).send({ message: `Получение пользователя с некорректным id: ${userId}.` });
      } else {
        res.status(http2.constants.STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  User.create(newUserData)
    .then((newUser) => {
      res.status(http2.constants.STATUS_CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.STATUS_BAD_REQUEST).send({
          message: `Пожалуйста, проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message.slice(5)}`).join(' ')}`,
        });
      } else {
        res.status(http2.constants.STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      res.status(http2.constants.STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${req.user._id} не найден` });
    } else {
      res.status(http2.constants.STATUS_OK).send(user);
    }
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.STATUS_BAD_REQUEST).send({ message: `Пожалуйста, проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message.slice(5)}`).join(' ')}` });
      } else {
        res.status(http2.constants.STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      res.status(http2.constants.STATUS_NOT_FOUND).send({ message: `Пользователь по указанному id: ${req.user._id} не найден` });
    } else {
      res.status(http2.constants.STATUS_OK).send(user);
    }
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.STATUS_BAD_REQUEST).send({ message: `Пожалуйста, проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message.slice(5)}`).join(' ')}` });
      } else {
        res.status(http2.constants.STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
