const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const UserRoute = require('./routes/user');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('welcome to product plus'));

//Route Files
app.use('/api/', UserRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`.yellow.underline.bold);
});