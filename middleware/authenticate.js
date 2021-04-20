const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'AzQ,PI)0(');

        req.user = decode;
        next();

    } catch (error) {
        res.json({
            success: false,
            message: 'Authentication Failed'
        });
    }
}

module.exports = authenticate;