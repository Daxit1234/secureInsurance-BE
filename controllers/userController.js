const User = require("../models/userModel");

class UserController {
  // Add new user
  addUser = async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Delete multiple users by IDs
  deleteUsers = async (req, res) => {
    try {
      const ids = req.body.ids;
      if (!ids || !Array.isArray(ids)) {
        return res
          .status(400)
          .json({ message: "Please provide an array of user IDs" });
      }
      await User.updateMany(
        { _id: { $in: ids } },
        { $set: { isDeleted: true } }
      );
      res.status(200).json({ message: "Users details deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // List users with pagination, search, and sorting
  list = async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      insuranceType = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // ✅ Base filter
    const filter = { isDeleted: false };

    // ✅ Filter by insurance type if tab is selected
    if (insuranceType) {
      filter.insuranceType = { $regex: new RegExp(insuranceType, "i") };
    }

    // ✅ Add search condition (name, email, members)
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { email: { $regex: new RegExp(search, "i") } },
        { members: { $regex: new RegExp(search, "i") } },
        { insuranceType: { $regex: new RegExp(search, "i") } },
      ];
    }

    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    try {
      const data = await User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      res.status(200).json({
        data,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  searchAll = async (req, res) => {
    // ✅ Base filter
    const filter = { isDeleted: false };
    try {
      const data = await User.find(filter);
      res.status(200).json({
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

// Export an instance of the class
module.exports = new UserController();
