const express = require("express");
const router = express.Router();
const systemController = require("../controllers/systemController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "system_uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
});

const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), systemController.add);
router.put("/edit/:id", upload.single("image"), systemController.edit);
router.get("/details/:id", systemController.details);
router.delete("/delete/:id", systemController.delete);
router.get("/list", systemController.list);

module.exports = router;
