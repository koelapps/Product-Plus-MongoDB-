const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
},  {timestamps: true});


const Auth = mongoose.model('Auth', authSchema);
module.exports =  Auth;