const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Невалидный идентификатор'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};

module.exports.getUserId = (req, res) => {
  const userId = req.user._id;

  User.find(userId)
    .then((user) => {
      if (user) return res.send({data: user})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный идентификатор'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Невалидный идентификатор'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const {name, about} = req.body;

  User.findByIdAndUpdate(userId, {name, about})
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Невалидный идентификатор'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const {avatar} = req.body;

  User.findByIdAndUpdate(userId, {avatar})
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Невалидный идентификатор'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: err.message});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};
