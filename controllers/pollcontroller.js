const Poll = require('../models/Poll');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');
const { pluralize, set } = require('mongoose');
const { db } = require('../models/User');

//Create Poll
const createPoll = asyncHandler(async (req, res, next) => {
  const { question, answer } = req.body;

  const poll = await Poll.create({
    question,
    answer,
  });

  const message = 'Poll Added Successfully';

  return res.status(201).json({
    success: true,
    data: { message, poll },
  });
});

//get all polls
const getAllPolls = asyncHandler(async (req, res, next) => {
  const questions = await Poll.find();
  return res.status(200).json({
    success: true,
    data: questions,
  });
});

//update poll using pollid
const updatePoll = asyncHandler(async (req, res, next) => {
  let poll = await Poll.findById(req.body.id);

  if (!poll) {
    return next(
      new ErrorResponse(`Poll not found with id of ${req.body.id}`, 404)
    );
  }

  poll = await Poll.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true,
  });

  const message = 'updated Successfully..';

  res.status(200).json({
    success: true,
    data: { message, poll },
  });
});

//Delete poll using id
const deletePoll = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findById(req.body.id);

  if (!poll) {
    return next(
      new ErrorResponse(`Poll not found with id of ${req.body.id}`, 404)
    );
  }

  await poll.remove();

  const message = `Poll with Question '${poll.question}' Deleted Successfully`;

  res.status(200).json({
    success: true,
    data: { message, poll },
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
  // let pollresponse =  result ;
  // const user = await User.findByIdAndUpdate(req.body.user_id, { pollresponse });
  await User.findByIdAndUpdate(req.body.user_id, {
    $push: {
      pollresponse: result,
    },
  });

  const message = 'Response Saved Succesfully';

  res.json({
    data: { message, result },
  });
});

//Pagination for polls using query params
const paginatePoll = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  const results = await Poll.find()

    .skip((page - 1) * limit)
    .select()
    .limit(limit * 1);
  res.status(200).json({ success: true, data: results });
});

module.exports = {
  createPoll,
  getAllPolls,
  updatePoll,
  deletePoll,
  pollResponse,
  paginatePoll,
};
