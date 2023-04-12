const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/not-found-error');

const app = express();

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^(https?:\/\/)(www\.)?([a-z1-9-]{2,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i),
  }),
}), createUser);

app.use(auth);

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(errorHandler);

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
