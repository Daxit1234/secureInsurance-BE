const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Add new user
router.post('/add', adminController.createAdmin);

// Delete user
router.post('/login', adminController.loginAdmin);

module.exports = router;
