const http2 = require('http2');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(http2.constants.HTTP_STATUS_OK).send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Проверьте правильность заполнения полей: ${Object.values(err.errors).map((error) => `${error.message}`).join(' ')}`);
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`);
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Карточка с указанным id: ${cardId} не существует в базе данных`);
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`);
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user._id } },
          { new: true },
        )
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Карточка с указанным id: ${cardId} не существует в базе данных.`);
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`);
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } },
          { new: true },
        )
          .then((removedCard) => res.status(http2.constants.HTTP_STATUS_OK).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Карточка с указанным id: ${cardId} не существует в базе данных`);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
