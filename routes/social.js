const express = require('express');
const router = express.Router();

const SocialController = require('../controllers/socialcontroller');
const authenticate = require('../middleware/authenticate');

router.get('/accounts/:id', authenticate, SocialController.getsocialAccounts);
router.post('/accounts', authenticate, SocialController.addsocialAccounts);
router.post(
  '/connect/facebook',
  authenticate,
  SocialController.connectAccountFacebook
);
router.post(
  '/connect/twitter',
  authenticate,
  SocialController.connectAccountTwitter
);
router.post(
  '/disconnect/facebook',
  authenticate,
  SocialController.disconnectAccountFacebook
);
router.post(
  '/disconnect/twitter',
  authenticate,
  SocialController.disconnectAccountTwitter
);

module.exports = router;
