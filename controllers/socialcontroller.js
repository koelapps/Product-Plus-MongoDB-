const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const { db } = require('../models/User');

//list of social connect
const getSocialAccounts = asyncHandler(async (req, res, next) => {
  const social = await User.findById(req.body.id);

  if (!social) {
    return next(
      new ErrorResponse(`No user found with the id of ${req.body.id}`, 404)
    );
  }

  const socialaccounts = await social.social;
  res.status(200).json({
    success: true,
    data: socialaccounts,
  });
});

//adding social accounts
const addSocialAccounts = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  const { social } = req.body;
  const account = await User.findByIdAndUpdate(req.body.id, {
    $push: {
      social,
    },
  });

  const message = `${req.body.social[0].type} Account for ${user.firstName} Added Successfully`;

  res.status(200).json({
    success: true,
    data: { message, social },
  });
});

//connect to social Acoounts
const connectAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  const accountConnect = [];
  await user.social.forEach((fieldElement) => {
    const account = {};
    if (fieldElement.type === req.query.account) {
      account.id = user.id;
      account.type = fieldElement.type;
      account.mid = fieldElement.mid;
      accountConnect.push(account);
    }
  });
  const connect = accountConnect[0];
  const message = `${connect.type} is connected Successfully`;
  res.status(200).json({
    success: true,
    data: { message, connect },
  });
});

//disconnect to social Acoount Facebook
const disConnectAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  const accountDisConnect = [];
  user.social.forEach((fieldElement) => {
    const account = {};
    if (fieldElement.type === req.query.account) {
      account.id = user.id;
      account.type = fieldElement.type;
      accountDisConnect.push(account);
    }
  });
  const disConnect = accountDisConnect[0];

  const message = `${disConnect.type} is DisConnected Successfully`;

  res.status(200).json({
    success: true,
    data: { message, disConnect },
  });
});

module.exports = {
  getsocialAccounts: getSocialAccounts,
  addsocialAccounts: addSocialAccounts,
  connectAccount,
  disconnectAccount: disConnectAccount,
};
