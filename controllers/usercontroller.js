const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const sendEmail = require('../util/sendEmail');
const ErrorResponse = require('../util/errorResponse');
const { db, findById } = require('../models/User');

//show the list of users
const getAllUsers = asyncHandler(async (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({
        success: true,
        count: response.length,
        data: response,
      });
    })
    .catch((error) => {
      res.json({ message: 'An error Occured' });
    });
});

// Get single user
const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.body.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});

//Register User
const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, dateOfBirth, social, news } =
    req.body;

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    social,
    news,
  });

  const message = 'User Registered Successfully..!';

  await user.save();
  sendRegisterResponse(user, 201, res, message);
});

//Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  if (!user) {
    return next(
      new ErrorResponse(`user not found with id of ${req.body.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: `User ${user.firstName} with id of ${user.id} Deleted Successfully`,
    data: user,
  });
});

//update User
const updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.body.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.body.id}`, 404)
    );
  }

  user = await User.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json({ success: true, message: 'Updated Successfully', data: user });
});

//Login user
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const message = 'Login successfully...!';

  sendLoginResponse(user, 200, res, message);
});

//Logout User
const logout = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  const message = 'Logout Success!!';

  res.status(200).json({
    success: true,
    data: { message },
  });
};

//get current user
const currentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  let profile = [];
  profile.push(user);

  const data = [];
  await profile.forEach((element) => {
    const proc = {};
    proc.id = element.id;
    proc.firstName = element.firstName;
    proc.lastName = element.lastName;
    proc.email = element.email;
    proc.dateOfBirth = element.dateOfBirth;
    data.push(proc);
  });

  res.status(200).json({
    success: true,
    data: data,
  });
});

//forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `To reset the password copy and paste the url and make PUT request to \n\n http://localhost:3000/resetpassword/${resetToken} \n\n `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

//Reset Passwod
const resetPassword = asyncHandler(async (req, res, next) => {
  //Get Hashed Token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPaswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  const message = 'Password changed successfully';
  sendResetPasswordResponse(user, 200, res, message);
});

//Responses

const sendRegisterResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const dataResult = [];
  dataResult.push(user);
  dataResult.forEach((element) => {
    const res = {};
    res.message = message;
    res.token = token;
    res.id = element.id;
    res.firstName = element.firstName;
    res.lastName = element.lastName;
    res.email = element.email;
    res.dob = element.dateOfBirth;
    res.news = element.news;
    +dataResult.push(res);
  });

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data: dataResult[1],
  });
};

const sendLoginResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data: { token, message },
  });
};

const sendResetPasswordResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const dataResult = [];
  dataResult.push(user);
  dataResult.forEach((element) => {
    const res = {};
    res.token = token;
    res.message = message;
    +dataResult.push(res);
  });

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data: dataResult[1],
  });
};

module.exports = {
  getallUsers: getAllUsers,
  getSingleUser,
  register,
  login,
  deleteUser,
  updateUser,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
};
