const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_400,
  ERROR_500,
} = require('../errors/errors');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const InaccurateDataError = require('../errors/inaccurate-data-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      userId = user._id;

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      const token = jwt.sign({ _id: userId }, 'secretKey', { expiresIn: '7d' });

      return res.status(200).send({ _id: token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) { return res.status(200).send({ data: user }); }
      return next(new NotFoundError('Пользователь не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Некорректные данные'));
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { userId } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { userId } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Невалидный идентификатор' });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};


module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) return user;

            return Promise.reject();
          });
      }

      return Promise.reject();
    })
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, 'secretKey', { expiresIn: '7d' },);

        return res.status(200).send({ _id: token });
      }

      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
}