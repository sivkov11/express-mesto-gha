const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const {
  ERROR_404,
} = require('./errors/errors');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '642410d423858e0dce38e32a',
  };

  next();
});

app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use((req, res) => {
  res.status(ERROR_404).send({ message: 'Страница не найдена' });
});

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
