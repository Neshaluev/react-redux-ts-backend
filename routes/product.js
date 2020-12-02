const express = require('express');
const passport = require('passport');

const controller = require('../controllers/product');
const router = express.Router();
const upload = require('../middleware/upload')

// localhost:5000/api/products
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.getAll
);

// localhost:5000/api/products/all/
router.get(
  '/all/',
  passport.authenticate('jwt', { session: false }),
  controller.getAllById
);

// localhost:5000/api/products
router.post(
  '/',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  controller.create
);

// localhost:5000/api/products/:id
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getById
);

// localhost:5000/api/products/:id
router.put(
  '/:id',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  controller.update
);

// localhost:5000/api/products/:id
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.remove
);

module.exports = router;
