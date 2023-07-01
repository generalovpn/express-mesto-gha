const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');

const getUsers = (req, res, next) => {
  User.find({}).then((users) => res.status(http2.constants.HTTP_STATUS_OK).send(users))
    .catch((error) => {
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь по указанному id: ${userId} не найден`));
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Пользователь с некорректным id: ${userId}`));
      } else {
        next(error);
      }
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь по указанному id: ${userId} не найден`));
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(`Пользователь с некорректным id: ${userId}`));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(`Проверьте правильность заполнения полей: ${Object.values(error.errors).map((err) => `${err.message.slice(5)}`).join(' ')}`));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует'));
      } else {
        next(error);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь по указанному id: ${userId} не найден`));
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(`Проверьте правильность заполнения полей: ${Object.values(error.errors).map((err) => `${err.message.slice(5)}`).join(' ')}`));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id: ${userId} не найден`);
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`Проверьте правильность заполнения полей: ${Object.values(error.errors).map((err) => `${err.message.slice(5)}`).join(' ')}`);
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не переданы данные');
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password)
        .then((correctPassword) => {
          if (!correctPassword) {
            throw new UnauthorizedError('Неправильные пользователь или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            'unique-secret-key',
            { expiresIn: '7d' },
          );
          return res.send({ jwt: token });
        });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
