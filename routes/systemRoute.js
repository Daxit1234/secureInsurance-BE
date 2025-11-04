const express = require("express");
const router = express.Router();
const systemController = require("../controllers/systemController");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// Add new user
router.post("/add", upload.single("image"), systemController.add);
router.put("/edit/:id", upload.single("image"), systemController.edit);
router.get("/details/:id", systemController.details);

// Delete user
router.delete("/delete/:id", systemController.delete);

router.get("/list", systemController.list);

module.exports = router;
