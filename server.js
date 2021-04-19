const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');
require('./controllers/GooglePassport');
const FacebookStrategy = require('passport-facebook')
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Route Files
app.use('/api/users', UserRoute);
app.use('/api/', AuthRoute);

//Google Auth
app.use(cookieSession({
    name: "Product Plus Session",
    keys: [process.env.JWT_SECRET]
}));

const isLoggedIn = (req, res, next) => {
    if(req.user){
        next();
    } else {
        res.sendStatus(401);
    }
}


app.use(passport.initialize());
app.use(passport.session());

app.get('/api/register');
app.get('/', (req, res) => res.send('you are not logged in...!!'));
app.get('/failed', (req, res) => res.send('you failed to log in...!!'));
app.get('/good', isLoggedIn, (req, res) => res.send(`welcome ${req.user.displayName}`));




app.get('/api/google',
  passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

app.get('/api/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send(req.user);
    
  });

  app.get('/api/google/logout', (req, res) => {
    req.logout();
    res.send("Logout Sucess");
    res.send(req.user);
  });




  


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`.yellow.underline.bold);
});