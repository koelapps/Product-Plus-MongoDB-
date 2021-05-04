const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newscontroller');
const authenticate = require('../middleware/authenticate');

router.post('/channel/follow', authenticate, newsController.channelFollow);
router.get('/channel/follow/feeds', authenticate, newsController.paginateFeed);
router.post('/channel/unfollow', authenticate, newsController.channelUnFollow);

module.exports = router;
