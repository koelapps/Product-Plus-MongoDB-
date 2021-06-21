const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollcontroller');

router.post('/createpoll', pollController.createPoll);
router.get('/getallpolls', pollController.getAllPolls);
router.put('/updatepoll', pollController.updatePoll);
router.delete('/deletepoll', pollController.deletePoll);
router.post('/pollresponse', pollController.pollResponse);
router.get('/polls', pollController.paginatePoll);

module.exports = router;
