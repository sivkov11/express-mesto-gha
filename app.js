const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '642410d423858e0dce38e32a',
  };

  next();
});

app.use('/users', routeUsers);
app.use('/cards', routeCards);

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
