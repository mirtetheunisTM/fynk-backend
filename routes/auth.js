var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', authController.signup);

/*router.post('/login', authController.login);
router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logout);
router.post('/changePassword', passport.authenticate('jwt', { session: false }), authController.changePassword);
router.delete('/deleteAccount', passport.authenticate('jwt', { session: false }), authController.deleteAccount);
router.put('/updateAccount', passport.authenticate('jwt', { session: false }), authController.updateAccount);*/

module.exports = router;
