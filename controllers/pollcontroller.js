const Poll = require('../models/Poll');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');
const { pluralize } = require('mongoose');

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

//Poll Response
const pollResponse = asyncHandler(async (req, res, next) => {
  let question = await Poll.findById(req.body.question_id);
  let poll = [];
  await question.answer.forEach((element) => {
    const object = {};
    if (element.id === req.body.answer_id) {
      object.question = question.question;
      object.answer = element.text;
      object.response = element.isCorrect;
      poll.push(object);
    }
  });
  let result = [];
  poll.forEach((elements) => {
    let finish = {};
    finish.question = elements.question;
    finish.answer = elements.answer;
    finish.response = elements.response;
    result.push(finish);
  });
  console.log(result);
  let pollresponse = { result };
  const user = await User.findByIdAndUpdate(req.body.user_id, { pollresponse });
  res.json({
    message: 'Response Saved Succesfully',
    data: result,
  });
});

module.exports = {
  createPoll,
  getAllPolls,
  updatePoll,
  deletePoll,
  pollResponse,
};
