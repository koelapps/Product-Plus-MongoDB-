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
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user) {
    const { social } = req.body;
    const account = await User.findByIdAndUpdate(req.params.id, {
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

//connect to social Acoount Facebook
const connectAccountFacebook = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.params.id);
  if (user) {
    const FacebookConnect = [];
    await user.social.forEach((fieldElement) => {
      const FacebookObject = {};
      if (fieldElement.type === 'Facebook') {
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
  }
});

//connect to social Acoount Twitter
const connectAccountTwitter = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.params.id);
  const TwitterConnect = [];
  user.social.forEach((element) => {
    const TwitterObject = {};
    if (element.type === 'Twitter') {
      TwitterObject.id = user.id;
      TwitterObject.type = element.type;
      TwitterObject.mid = element.mid;
      TwitterConnect.push(TwitterObject);
    }
  });
  res.status(200).json({
    success: true,
    data: TwitterConnect,
  });
});

//disconnect to social Acoount Facebook
const disconnectAccountFacebook = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.params.id);
  const FacebookdisConnect = [];
  user.social.forEach((fieldElement) => {
    const FacebookObject = {};
    if (fieldElement.type === 'Facebook') {
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

//disconnect to social Acoount Twitter
const disconnectAccountTwitter = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.params.id);
  const TwitterdisConnect = [];
  user.social.forEach((element) => {
    const TwitterObject = {};
    if (element.type === 'Twitter') {
      TwitterObject.id = user.id;
      TwitterObject.type = element.type;
      TwitterdisConnect.push(TwitterObject);
    }
  });
  res.status(200).json({
    success: true,
    data: TwitterdisConnect,
  });
});

module.exports = {
  getsocialAccounts,
  addsocialAccounts,
  connectAccountFacebook,
  connectAccountTwitter,
  disconnectAccountFacebook,
  disconnectAccountTwitter,
};
