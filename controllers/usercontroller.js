const User = require('../models/User');

//show the list of users
const getallUsers = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            success: true,
            count: response.length,
            data: response
        });
    })
    .catch(error => {
        res.json({message: 'An error Occured'})
    });
}

//Get Single User
const getSingleUser = (req, res, next) => {
    let userID = req.body.userID;
    User.findById(userID)
    .then(response => {
        res.json({
            success: true,
            data: response
        });
    }).catch(error => {
        res.json({message: 'An error Occured'})
    });
} 

//Create new User
const createUser = (req, res, next) => {
    let user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob
    });
    user.save()
    .then(response => {
        res.json({success: true, message: 'User Added Successfully'})
    }).catch(error=> {
        res.json({success: false, message: 'An error occured'})
    });
}

//update an user
const updateUser = (req, res, next) => {
    let userID = req.body.userID;
    let updatedData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob
    }
    User.findByIdAndUpdate(userID, {$set: updatedData})
    .then(() => {
        res.json({
            message: 'User Updated successfully'
        })
    })
    .catch(error => {
        res.json({success: false, message: 'An error occured'})
    });

}

//Delete User
const deleteUser = (req, res, next) => {
    let userID = req.body.userID;
    User.findByIdAndDelete(userID)
    .then(() => {
        res.json({
            message: 'User Deleted successfully'
        })
    })
    .catch(error => {
        res.json({success: false, message: 'An error occured'})
    });
}

module.exports = {
    getallUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
};