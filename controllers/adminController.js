const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");

class AdminController {
  // Add new user
  loginAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ username });
      if (!admin)
        return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      res.json({ message: "Login successful" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  createAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ username, password: hashedPassword });
      res.json({ message: "Admin created" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

// Export an instance of the class
module.exports = new AdminController();
