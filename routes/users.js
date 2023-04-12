const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserId, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');

const urlRegex = /^(https?:\/\/)(www\.)?([a-z1-9-]{2,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i;

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserId);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(urlRegex),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
