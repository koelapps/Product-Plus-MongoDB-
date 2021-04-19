const passport = require('passport');
const Auth = require('../models/Auth');
const asyncHandler = require('../middleware/async');

 //GoogleLogin 
 const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { currentUser } = require('./AuthController');

 passport.serializeUser(function(id, done){
     done(null, id);
 });
 passport.deserializeUser(function(id, done){
    Auth.findById(id).then(user => {
        done(null, user);
    })
     
 });

 passport.use(new GoogleStrategy({
 clientID: '755668545952-al5iief0s3jen1s5mj92n68pgue8ngbk.apps.googleusercontent.com',
 clientSecret: 'nNkxujgJwcPQzJfTvhd1hm8s',
 callbackURL: "http://localhost:5000/api/google/redirect",
 passReqToCallback: true,
 profileFields : ["id", "firstname", "lastname", "email"]
}, async (req, res, accessToken, refreshToken, profile, done) => {
   const newAuth = {
       googleId: profile.id,
       firstname: profile.name.givenName,
       lastname: profile.name.familyName,
       email: profile.emails[0].value
   }
   try {
       let user = await Auth.findOne({  email: profile.emails[0].value });
       if(user)
       {    
           return done(null, user);
       }else {
           user = await Auth.create(newAuth);
           done(null, user);
       }
   } catch (err) {
       console.error(err);
   }
}
));