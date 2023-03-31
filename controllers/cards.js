const Card = require('../models/card');
const {
  ERROR_400,
  ERROR_404,
  ERROR_500,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { userId } = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) { return res.status(200).send({ data: card, message: 'like' }); }
      return res.status(ERROR_404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      if (card) { return res.status(200).send({ data: card, message: 'like' }); }
      return res.status(ERROR_404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      if (card) { return res.status(200).send({ data: card, message: 'dislike' }); }
      return res.status(ERROR_404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};
