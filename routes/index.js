const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { validationSignup, validationSignin } = require('../utils/validation');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.post('/signin', validationSignin, login);
router.post('/signup', validationSignup, createUser);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/', auth, (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
