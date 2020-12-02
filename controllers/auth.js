const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id
        },
        keys.jwt,
        { expiresIn: 60 * 60 }
      );

      const user = {
        firstname: candidate.firstname,
        lastname: candidate.lastname
      }
      res.status(200).json({
        data: user,
        token: `Bearer ${token}`
      });
    } else {
      res.status(401).json({
        message: 'Пароли не совпадают. Попробуйте снова.'
      });
    }
  } else {
    res.status(404).json({
      message: 'Пользователь с таким email не найден.'
    });
  }
};

module.exports.register = async function(req, res) {
  console.log('Регистрация пользователя', req.body)
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      message: 'Такой email уже занят. Попробуйте другой.'
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    try {
      await user.save();
      const userData = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      }
      res.status(201).json(userData);
    } catch (e) {
      errorHandler(res, e);
    }
  }
};

module.exports.authorization = async function(req, res) {
  const user = await User.findOne({ email: req.body.email });
  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(200).json(error);
  }
};
