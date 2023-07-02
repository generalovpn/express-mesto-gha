const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../utils/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validationUserId, getUserById);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
