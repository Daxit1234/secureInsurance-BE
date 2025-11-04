const SystemDataModel = require("../models/systemDataModel");
const path = require("path");
const fs = require("fs");

function deleteFileIfExists(filename) {
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "uploads", filename); 
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted:", filePath);
    });
  } else {
    console.warn("File not found:", filePath);
  }
}

class SystemController {
  async add(req, res) {
    try {
      const SystemData = new SystemDataModel({
        section: req.body.section,
        details: req.body.details ? JSON.parse(req.body.details) : {},
        imageUrl: req.file ? req.file.filename : null,
        order: req.body.order || 0,
      });
      await SystemData.save();
      res.status(201).json(SystemData);
    } catch (error) {
      console.error("Create Error:", error);
      res.status(500).json({ message: "Failed to upload image", error });
    }
  }
  async edit(req, res) {
    try {
      const SystemData = await SystemDataModel.findById(req.params.id);
      if (!SystemData)
        return res.status(404).json({ message: "Image not found" });

      // If new file uploaded → delete old one
      if (req.file && SystemData.imageUrl) {
        deleteFileIfExists(SystemData.imageUrl);
        SystemData.imageUrl = req.file.filename;
      }

      SystemData.section = req.body.section || SystemData.section;
      SystemData.details = req.body.details
        ? JSON.parse(req.body.details)
        : SystemData.details;
      SystemData.order = req.body.order || SystemData.order;

      await SystemData.save();
      res.json(SystemData);
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Failed to update image", error });
    }
  }

  async details(req, res) {
    try {
      const SystemData = await SystemDataModel.findById(req.params.id);
      if (!SystemData)
        return res.status(404).json({ message: "data not found" });
      res.json(SystemData);
    } catch (error) {
      console.error("Read Error:", error);
      res.status(500).json({ message: "Failed to fetch image", error });
    }
  }
  async list(req, res) {
    try {
      const { section } = req.query;
      const query = section ? { section } : {};
      const SystemData = await SystemDataModel.find(query).sort({ order: 1 });
      res.json(SystemData);
    } catch (error) {
      console.error("Read Error:", error);
      res.status(500).json({ message: "Failed to fetch images", error });
    }
  }
  async delete(req, res) {
    try {
      const SystemData = await SystemDataModel.findById(req.params.id);
      if (!SystemData)
        return res.status(404).json({ message: "Data not found" });

      // Delete file from uploads folder
      if (SystemData.imageUrl) {
        deleteFileIfExists(SystemData.imageUrl);
      }

      await SystemDataModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Failed to delete image", error });
    }
  }
}

// Export an instance of the class
module.exports = new SystemController();
