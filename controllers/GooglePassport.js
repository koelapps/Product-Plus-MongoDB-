const passport = require('passport');

 //GoogleLogin 
 const GoogleStrategy = require('passport-google-oauth20').Strategy;

 passport.serializeUser(function(user, done){
     done(null, user);
 });
 passport.deserializeUser(function(user, done){
    // User.findById(id, function(err, user) {
         done(null, user);
    // });
 });

 passport.use(new GoogleStrategy({
 clientID: '755668545952-al5iief0s3jen1s5mj92n68pgue8ngbk.apps.googleusercontent.com',
 clientSecret: 'nNkxujgJwcPQzJfTvhd1hm8s',
 callbackURL: "http://localhost:5000/api/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    //use the profile Info to check user is registered in ur db 
 //User.findOrCreate({ googleId: profile.id }, function (err, user) {
  return done(null, profile);
 //});
}
));