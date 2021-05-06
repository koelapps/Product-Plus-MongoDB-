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
  //const socialaccounts = await social.social;
  res.status(200).json({
    success: true,
    id: req.body.id,
    user: social.email,
    socialAccounts: social.social,
  });
});

//adding social accounts
const addSocialAccounts = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  if (user) {
    const { social } = req.body;
    const account = await User.findByIdAndUpdate(req.body.id, {
      social,
    });
    res.status(200).json({
      success: true,
      message: 'Social Accounts Added Successfully',
      Accounts: req.body,
    });
  } else {
    return next(
      new ErrorResponse(`No user found with the id of ${req.params.id}`, 404)
    );
  }
});

//connect to social Acoounts
const connectAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  if (user) {
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
    res.status(200).json({
      success: true,
      data: connect,
    });
  } else {
    return next(
      new ErrorResponse(`No user found with the id of ${req.params.id}`, 404)
    );
  }
});

//disconnect to social Acoount Facebook
const disConnectAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  if (user) {
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
    res.status(200).json({
      success: true,
      data: disConnect,
    });
  } else {
    return next(
      new ErrorResponse(`No user found with the id of ${req.params.id}`, 404)
    );
  }
});

module.exports = {
  getsocialAccounts: getSocialAccounts,
  addsocialAccounts: addSocialAccounts,
  connectAccount,
  disconnectAccount: disConnectAccount,
};
