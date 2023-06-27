const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;
