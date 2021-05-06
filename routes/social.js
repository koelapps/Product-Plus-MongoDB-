const express = require('express');
const router = express.Router();

const socialController = require('../controllers/socialcontroller');
const authenticate = require('../middleware/authenticate');

router.post('/accounts', authenticate, socialController.addsocialAccounts);
router.get('/getaccounts', authenticate, socialController.getsocialAccounts);
router.post('/connect', authenticate, socialController.connectAccount);
router.post('/disconnect', authenticate, socialController.disconnectAccount);

module.exports = router;
