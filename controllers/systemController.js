const SystemDataModel = require("../models/systemDataModel");
const cloudinary = require("../config/cloudinary");

class SystemController {
  async add(req, res) {
    try {
      const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

      const SystemData = new SystemDataModel({
        section: req.body.section,
        details: req.body.details ? JSON.parse(req.body.details) : {},
        imageUrl,
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
        return res.status(404).json({ message: "Data not found" });

      if (req.file && SystemData.imageUrl) {
        // Delete old image from Cloudinary
        const publicId = SystemData.imageUrl.split("/").pop().split(".")[0];
        console.log(publicId)
        await cloudinary.uploader.destroy(`system_uploads/${publicId}`);
        SystemData.imageUrl = req.file.path;
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
        return res.status(404).json({ message: "Data not found" });
      res.json(SystemData);
    } catch (error) {
      console.error("Read Error:", error);
      res.status(500).json({ message: "Failed to fetch data", error });
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
      res.status(500).json({ message: "Failed to fetch list", error });
    }
  }

  async delete(req, res) {
    try {
      const SystemData = await SystemDataModel.findById(req.params.id);
      if (!SystemData)
        return res.status(404).json({ message: "Data not found" });

      if (SystemData.imageUrl) {
        const publicId = SystemData.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`system_uploads/${publicId}`);
      }

      await SystemDataModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Failed to delete data", error });
    }
  }
}

module.exports = new SystemController();
