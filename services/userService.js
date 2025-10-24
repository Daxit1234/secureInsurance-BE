const User = require('../models/userModel');

// Create new user
exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

// Delete user by ID
exports.deleteUsers = async (req) => {
  const ids = req.body.ids;
  return await User.deleteMany({ _id: { $in: ids } });
};

