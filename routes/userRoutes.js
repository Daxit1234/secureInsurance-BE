const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add new user
router.post('/add', userController.addUser);

// Delete user
router.post('/delete', userController.deleteUsers);

router.get('/list', userController.list);
router.get('/searchAll', userController.searchAll);

module.exports = router;
