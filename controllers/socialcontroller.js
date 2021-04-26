const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');

//list of social connect
const getsocialAccounts = asyncHandler(async (req, res, next) => {
  const social = await User.findById(req.params.id);

  if (!social) {
    return next(
      new ErrorResponse(`No user found with the id of ${req.params.id}`, 404)
    );
  }
  //const socialaccounts = await social.social;
  res.status(200).json({
    success: true,
    id: req.params.id,
    user: social.email,
    socialAccounts: social.social,
  });
});

//adding social accounts
const addsocialAccounts = asyncHandler(async (req, res, next) => {
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
    const FacebookConnect = [];
    await user.social.forEach((fieldElement) => {
      const FacebookObject = {};
      if (fieldElement.type === req.query.account) {
        FacebookObject.id = user.id;
        FacebookObject.type = fieldElement.type;
        FacebookObject.mid = fieldElement.mid;
        FacebookConnect.push(FacebookObject);
      }
    });
    res.status(200).json({
      success: true,
      data: FacebookConnect,
    });
  } else {
    return next(
      new ErrorResponse(`No user found with the id of ${req.params.id}`, 404)
    );
  }
});

//disconnect to social Acoount Facebook
const disconnectAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  const FacebookdisConnect = [];
  user.social.forEach((fieldElement) => {
    const FacebookObject = {};
    if (fieldElement.type === req.query.account) {
      FacebookObject.id = user.id;
      FacebookObject.type = fieldElement.type;
      FacebookdisConnect.push(FacebookObject);
    }
  });
  res.status(200).json({
    success: true,
    data: FacebookdisConnect,
  });
});

module.exports = {
  getsocialAccounts,
  addsocialAccounts,
  connectAccount,
  disconnectAccount,
};
