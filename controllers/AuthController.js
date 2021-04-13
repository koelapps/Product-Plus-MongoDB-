const Auth = require('../models/Auth');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const sendEmail = require('../util/sendEmail');
const ErrorResponse = require('../util/errorResponse');

//Register User
const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
       if(err){
           res.json({
               error:err
           });
       } 
       let user = new Auth({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass
        });
        user.save()
        .then(user => {
        res.status(200).json({
            success: true,
            message: 'User Added Successfully'
        });
    })
    .catch(error => {
        res.status(404).json({success: false, message: `User with this mail ID is already registered`})
    });
});

}

//Login User
const login = (req, res, next) => {
    var username =  req.body.username;
    var password = req.body.password;
 
    Auth.findOne({email: username})
    .then (user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    res.status(404).json({success: false, error: err});
                }
                if(result){
                    let token = sendTokenResponse();
                    res.status(200).json({
                        success: true,
                        message: 'Login Successful',
                        data: user,
                        token
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        message: 'Password does not Matched'
                    });
                }
            });
        }else{
            res.json({message: 'No User Found', success: false});
        }
    })
 }

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

//Forgot Password
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await Auth.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }
  
    // Get reset token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/resetpassword/${resetToken}`;
  
    const message = `To reset the User password kindly use PUT request using this URL to \n\n ${resetUrl}`;
  
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
    register, login, logout, forgotPassword, resetPassword
};