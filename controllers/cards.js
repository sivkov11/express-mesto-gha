const Card = require('../models/card');
// const ConflictError = require('../errors/conflict-error'); // 409
const InaccurateDataError = require('../errors/inaccurate-data-error'); // 400
const NotFoundError = require('../errors/not-found-error'); // 404
// const UnauthorizedError = require('../errors/unauthorized-error'); // 401
const ForbiddenError = require('../errors/forbidden-error'); // 403

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }));
};

module.exports.createCard = (req, res, next) => {
  const { userId } = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Некорректные данные'));
      }
    });
};

module.exports.deleteCardsById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      if (!(card.owner._id.toString() === req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку!');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardDelete) => res.send({ data: cardDelete }))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Некорректные данные'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Некорректные данные'));
      }
    });
};
