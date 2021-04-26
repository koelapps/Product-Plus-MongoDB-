const express = require('express');
const router = express.Router();

const SocialController = require('../controllers/socialcontroller');
const authenticate = require('../middleware/authenticate');

router.post('/accounts', authenticate, SocialController.addsocialAccounts);
router.get('/accounts/:id', authenticate, SocialController.getsocialAccounts);
router.post('/connect', authenticate, SocialController.connectAccount);
router.post('/disconnect', authenticate, SocialController.disconnectAccount);

module.exports = router;
