const express = require('express');
const router = express.Router();

const UserController = require('../controllers/usercontroller');
const authenticate = require('../middleware/authenticate');

router.get('/allusers', authenticate, UserController.getallUsers);
router.get('/singleuser', authenticate, UserController.getSingleUser);
router.post('/register', UserController.register);
router.delete('/deleteuser', authenticate, UserController.deleteUser);
router.put('/updateuser', authenticate, UserController.updateUser);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/currentuser', authenticate, UserController.currentUser);
router.post('/forgotpassword', UserController.forgotPassword);
router.put('/resetpassword/:resettoken', UserController.resetPassword);

module.exports = router;
