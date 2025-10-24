const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add new user
router.post('/add', userController.addUser);

// Delete user
router.post('/delete', userController.deleteUsers);

router.post('/list', userController.list);

module.exports = router;
