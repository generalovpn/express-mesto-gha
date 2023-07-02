const { celebrate, Joi } = require('celebrate');

const URL_REGEX = /https?:\/\/(www\.)?(\w+[-.~:/?#[\]@!$&'()*+,;=]*)*\.\w+(\w*[-.~:/?#[\]@!$&'()*+,;=]*)*#?/;

const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REGEX),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validationSignin,
  validationSignup,
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateCard,
  validationCardId,
};
