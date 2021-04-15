const User = require('../models/User');
const asyncHandler = require('../middleware/async');

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

// Get single user
const getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({ success: true, data: user });
  });

//Create new User
const createUser = (req, res, next) => {
    let user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob,
        mobile: req.body.mobile
    });
    user.save()
    .then(response => {
        res.json({success: true, message: 'User Added Successfully', data: user})
    }).catch(error=> {
        res.json({success: false, message: 'An error occured'})
    });
}

// Update User
const updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({ success: true, data: user });
  });



//Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
  
    await user.remove();
  
    res.status(200).json({ success: true, data: {} });
  });

module.exports = {
    getallUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
};