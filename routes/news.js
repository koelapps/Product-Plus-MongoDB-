const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newscontroller');
const authenticate = require('../middleware/authenticate');

router.post('/channel/follow', newsController.channelFollow);
router.get('/channel/follow/feeds', newsController.paginateFeed);
router.post('/channel/unfollow', newsController.channelUnFollow);

module.exports = router;
