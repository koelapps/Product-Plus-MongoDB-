const Auth = require('../models/Auth');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const sendEmail = require('../util/sendEmail');
const ErrorResponse = require('../util/errorResponse');

//show the list of users
const getallUsers = (req, res, next) => {
  Auth.find()
  .then(response => {
      res.json({
          success: true,
          count: response.length,
          data: response
      });
  })
  .catch(error => {
      res.json({message: 'An error Occured'})
  });
}

//Register User
const register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  // Create user
  const user = await Auth.create({
    firstname,
    lastname,
    email,
    password
  });

  await user.save().then(user => {
    sendTokenResponse(user, 200, res);
    res.status(200).json({
      success: true,
      message: 'User Added Successfully'
    });
  })
  .catch(error => {
    res.status(404).json({success: false, message: `User with this mail ID is already registered`})
});
  

});

//Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Auth.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`user not found with id of ${req.params.id}`, 404)
    );
  }


  await user.remove();

  res.status(200).json({ success: true, data: {} });
});

//update User
const updateUser = asyncHandler(async (req, res, next) => {
  let user = await Auth.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  user = await Auth.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});



//Login user
const login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  const user = await Auth.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

//Logout User
const logout = (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
    
      res.status(200).json({
        success: true,
        message: 'Logout Success!!'
      });
}

//get current user
const currentUser = asyncHandler(async (req, res, next) => {

  const user = req.user;

  res.status(200).json({
    success: true,
    data: user
  });
});



//forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await Auth.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/resetpassword/${resetToken}`;

  const message = `To reset the password copy and paste the url and make PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
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
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await Auth.findOne({
        resetPasswordToken,
        resetPaswordExpire: {$gt: Date.now()}
    });
    if(!user){
        return next(new ErrorResponse('Invalid Token', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});


//Sending token to the cookie
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  };


module.exports = {
    getallUsers, 
    register, 
    login, 
    deleteUser,
    updateUser,  
    logout, 
    currentUser,
    forgotPassword, 
    resetPassword
};