const Cards = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для лайка' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для дизлайка' });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
