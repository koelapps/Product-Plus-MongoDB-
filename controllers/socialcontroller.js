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
    const AccountConnect = [];
    await user.social.forEach((fieldElement) => {
      const AccountObject = {};
      if (fieldElement.type === req.query.account) {
        AccountObject.id = user.id;
        AccountObject.type = fieldElement.type;
        AccountObject.mid = fieldElement.mid;
        AccountConnect.push(AccountObject);
      }
    });
    res.status(200).json({
      success: true,
      data: AccountConnect,
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
  const AccountdisConnect = [];
  user.social.forEach((fieldElement) => {
    const AccountObject = {};
    if (fieldElement.type === req.query.account) {
      AccountObject.id = user.id;
      AccountObject.type = fieldElement.type;
      AccountdisConnect.push(AccountObject);
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
