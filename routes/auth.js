var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// The following routes are protected by JWT authentication
router.post('/changePassword', authMiddleware, authController.changePassword);
router.delete('/deleteAccount', authMiddleware, authController.deleteAccount);
router.put('/updateAccount', authMiddleware, authController.updateAccount);
router.get('/users/:id', authMiddleware, authController.getUserById);
router.get('/users/email/:email', authMiddleware, authController.getUserByEmail);

// Admin route to get active users
// Nog extra check for admin role to be implemented
router.get('/activeUsers', authMiddleware, authController.getActiveUsers);

module.exports = router;
