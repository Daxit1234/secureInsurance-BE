const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    dob: { type: Date },
    gender: { type: String },
    phoneNo: { type: Number },
    insuranceType: { type: String },
    members: { type: [String] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
