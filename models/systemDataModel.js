const mongoose = require("mongoose");

const systemDataSchema = new mongoose.Schema(
  {
    section: {
      type: String,
    }, 
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    imageUrl: {
      type: String,
    },
    order: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemData", systemDataSchema);
