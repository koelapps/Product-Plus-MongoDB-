const express = require('express');
const router = express.Router();

const UserController = require('../controllers/usercontroller');
const authenticate  = require('../middleware/authenticate');


router.get('/allusers', authenticate, UserController.getallUsers);
router.get('/singleuser/:id', authenticate, UserController.getSingleUser);
router.post('/register', UserController.register);
router.delete('/deleteuser/:id', authenticate, UserController.deleteUser);
router.put('/updateuser/:id', authenticate, UserController.updateUser);
router.post('/login', UserController.login);
router.post('/logout',UserController.logout);
router.get('/currentuser', authenticate, UserController.currentUser);
router.post('/forgotpassword',UserController.forgotPassword);
router.put('/resetpassword/:resettoken',UserController.resetPassword);
router.get('/socialaccounts/:id', authenticate, UserController.getsocialAccounts);


module.exports = router;