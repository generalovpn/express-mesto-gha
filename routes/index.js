const router = require('express').Router();
const http2 = require('http2');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});

module.exports = router;
