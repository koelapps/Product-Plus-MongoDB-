const express = require('express');
const router = express.Router();

const userController = require('../controllers/usercontroller');
const authenticate = require('../middleware/authenticate');

router.get('/allusers', authenticate, userController.getallUsers);
router.get('/singleuser', authenticate, userController.getSingleUser);
router.post('/register', userController.register);
router.delete('/deleteuser', authenticate, userController.deleteUser);
router.put('/updateuser', authenticate, userController.updateUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/currentuser', authenticate, userController.currentUser);
router.post('/forgotpassword', userController.forgotPassword);
router.put('/resetpassword/:resettoken', userController.resetPassword);

module.exports = router;
