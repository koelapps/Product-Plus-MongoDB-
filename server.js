const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');

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





const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`.yellow.underline.bold);
});


