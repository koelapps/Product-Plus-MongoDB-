const express = require('express');
const router = express.Router();

const UserController = require('../controllers/usercontroller');
const User = require('../models/User');
const authenticate  = require('../middleware/authenticate');

router.get('/', authenticate, UserController.getallUsers);
router.get('/show/:id', authenticate, UserController.getSingleUser);
router.post('/create', authenticate, UserController.createUser);
router.post('/update/:id', authenticate, UserController.updateUser);
router.delete('/delete/:id', authenticate, UserController.deleteUser);

module.exports = router;