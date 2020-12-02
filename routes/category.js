const express = require('express');
const passport = require('passport');

const controller = require('../controllers/category');
const router = express.Router();
const upload = require('../middleware/upload')

// localhost:5000/api/categories
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.getAll
);
// localhost:5000/api/categories/all/
router.get(
  '/all/',
  passport.authenticate('jwt', { session: false }),
  controller.getAllStatic
);

// localhost:5000/api/categories
router.post(
  '/',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  controller.create
);

// localhost:5000/api/categories/:id
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getById
);

// localhost:5000/api/categories/:id
router.patch(
  '/:id',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  controller.update
);

// localhost:5000/api/categories/:id
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  controller.remove
);

module.exports = router;
