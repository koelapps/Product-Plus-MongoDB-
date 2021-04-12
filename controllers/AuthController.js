const Auth = require('../models/Auth');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

//Register User
const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
       if(err){
           res.json({
               error:err
           });
       } 
       let user = new Auth({
        email: req.body.email,
        password: hashedPass
        });
        user.save()
        .then(user => {
        res.json({
            success: true,
            message: 'User Added Successfully'
        });
    })
    .catch(error => {
        res.json({success: false, message: 'An Error Occured'})
    });
});

}

//Login User
const login = (req, res, next) => {
   var username =  req.body.username;
   var password = req.body.password;

   Auth.findOne({$or: [{email: username}, {phone: username}]})
   .then (user => {
       if(user){
           bcrypt.compare(password, user.password, function(err, result) {
               if(err){
                   res.json({success: false, error: err});
               }
               if(result){
                   let token = jwt.sign({name: user.name}, 'AzQ,PI)0(', {expiresIn: '1h'});
                   res.json({
                       success: true,
                       message: 'Login Successful',
                       token
                   });
               }else{
                   res.json({
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


module.exports = {
    register, login, logout
};