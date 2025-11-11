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
      const { section, page = 1, limit = 10 } = req.query;
      const query = { section, isDeleted: false };
      if (!section) delete query.section;

      const data = await SystemDataModel.find(query)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const total = await SystemDataModel.countDocuments(query);

      res.status(200).json({
        data,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error("Read Error:", error);
      res.status(500).json({ message: "Failed to fetch list", error });
    }
  }
  deleteSystemData = async (req, res) => {
    try {
      const ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res
          .status(400)
          .json({ message: "Please provide an array of SystemData IDs" });
      }

      // Find all system data entries to delete
      const systemDataList = await SystemDataModel.find({ _id: { $in: ids } });

      if (systemDataList.length === 0) {
        return res.status(404).json({ message: "No matching records found" });
      }

      // Delete images from Cloudinary
      for (const item of systemDataList) {
        if (item.imageUrl) {
          try {
            const publicId = item.imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`system_uploads/${publicId}`);
          } catch (err) {
            console.warn(
              `⚠️ Failed to delete image for ID ${item._id}:`,
              err.message
            );
          }
        }
      }

      // Soft delete (set isDeleted = true)
      await SystemDataModel.updateMany(
        { _id: { $in: ids } },
        { $set: { isDeleted: true } }
      );

      res.status(200).json({ message: "System data deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Failed to delete system data", error });
    }
  };
}

module.exports = new SystemController();
