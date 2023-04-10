const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  ERROR_404,
} = require('./errors/errors');

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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use((req, res) => {
  res.status(ERROR_404).send({ message: 'Страница не найдена' });
});

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
