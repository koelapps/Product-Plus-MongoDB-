const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const authenticate  = require('../middleware/authenticate');


router.get('/allusers', authenticate, AuthController.getallUsers);
router.post('/register', AuthController.register);
router.delete('/deleteuser/:id', authenticate, AuthController.deleteUser);
router.put('/updateuser/:id', authenticate, AuthController.updateUser);
router.post('/login', AuthController.login);
router.post('/logout',AuthController.logout);
router.get('/currentuser', authenticate, AuthController.currentUser);
router.post('/forgotpassword',AuthController.forgotPassword);
router.put('/resetpassword/:resettoken',AuthController.resetPassword);

module.exports = router;