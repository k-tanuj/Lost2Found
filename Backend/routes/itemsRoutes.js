const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const verifyToken = require('../middleware/authMiddleware');

// The route will be /api/items/:type (e.g., /api/items/lost or /api/items/found)
router.get('/:type', itemsController.getItems);
router.post('/:type', verifyToken, itemsController.createItem);

module.exports = router;
