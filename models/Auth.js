const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    resetPasswordToken: String,
    resetPaswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
},  {timestamps: true});

// Encrypt password using bcrypt
authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
  

// Sign JWT and return
authSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, 'AzQ,PI)0(', {
      expiresIn: '1h',
    });
  };

authSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
  


authSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPaswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


// Generate email confirm token
authSchema.methods.generateEmailConfirmToken = function (next) {
    // email confirmation token
    const confirmationToken = crypto.randomBytes(20).toString('hex');
  
    this.confirmEmailToken = crypto
      .createHash('sha256')
      .update(confirmationToken)
      .digest('hex');
  
    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
    return confirmTokenCombined;
  };

const Auth = mongoose.model('Auth', authSchema);
module.exports =  Auth;