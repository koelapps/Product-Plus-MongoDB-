const Poll = require('../models/Poll');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');

//Create Poll
const createPoll = asyncHandler(async (req, res, next) => {
  const { question } = req.body;
  const { answer } = req.body;

  const poll = await Poll.create({
    question,
    answer,
  });
  return res.status(201).json({
    question,
    answer,
  });
});

//get all polls
const getAllPolls = asyncHandler(async (req, res, next) => {
  const questions = await Poll.find();
  return res.status(200).json({
    questions,
  });
});

//update poll using pollid
const updatePoll = asyncHandler(async (req, res, next) => {
  const { question, answer, text } = req.body;
  const poll = await Poll.findByIdAndUpdate(req.body.id, {
    question,
    answer,
    text,
  });

  res.json({
    success: true,
    message: 'updated Successfully..',
    data: req.body,
  });
});

//Delete poll using id
const deletePoll = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findByIdAndDelete(req.body.id);
  res.json({
    success: true,
    message: 'Poll Deleted successfully...',
    data: poll,
  });
});

module.exports = {
  createPoll,
  getAllPolls,
  updatePoll,
  deletePoll,
};
