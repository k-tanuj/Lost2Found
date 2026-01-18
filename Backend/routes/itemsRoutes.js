const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const verifyToken = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { validate, schemas } = require('../middleware/validationMiddleware');

router.get('/user/:userId', itemsController.getUserItems);
router.get('/:type', itemsController.getItems);

// Specific routes must come before parameterized routes
router.post('/claim', verifyToken, validate(schemas.claim), itemsController.claimItem);

// Add logging middleware before multer
router.post('/:type', verifyToken, validate(schemas.item), (req, res, next) => {
    console.log("📥 POST /:type route hit");
    next();
}, upload.single('image'), itemsController.createItem);

router.get('/detail/:id', itemsController.getItemById);
router.put('/:id/status', verifyToken, itemsController.updateItemStatus);

module.exports = router;
