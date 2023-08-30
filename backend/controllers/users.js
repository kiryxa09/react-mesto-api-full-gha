const httpConstants = require('http2').constants;
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const UnAuthError = require('../errors/unauth-err');
const StatusConflictError = require('../errors/stat-confl-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные'));
      }
      return next(e);
    });
};

const getUserbyId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadReqError('Переданы некорректные данные'));
      } if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      return next(e);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return next(new BadReqError('Переданы некорректные данные'));
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res
        .status(httpConstants.HTTP_STATUS_CREATED)
        .send({
          _id, email, name, about, avatar,
        });
    })
    .catch((e) => {
      if (e.code === 11000) {
        return next(new StatusConflictError('Email уже используется'));
      } if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные'));
      }
      return next(e);
    });
  return true;
};

const updateProfile = (req, res, next) => {
  const {
    name, about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail()
    .then((user) => res.send({ user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные'));
      } if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      return next(e);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => res.send({ user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные'));
      } if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      return next(e);
    });
};

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      res.send({ user });
    })
    .catch((e) => {
      if (e) {
        return next(new UnAuthError(e.message));
      }
      return next(e);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadReqError('Переданы некорректные данные'));
      } if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      return next(e);
    });
};

module.exports = {
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
  getUserbyId,
  login,
  getUserInfo,
};
