const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const verifyToken = require('../middleware/authMiddleware');
const { reportLimiter, claimLimiter } = require('../middleware/rateLimiter');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { validate, schemas } = require('../middleware/validationMiddleware');

router.get('/user/:userId', itemsController.getUserItems);
router.get('/:type', itemsController.getItems);

// Specific routes must come before parameterized routes
// Claim an item (with rate limiting: 5/hour)
router.post('/claim', verifyToken, claimLimiter, validate(schemas.claim), itemsController.claimItem);

// Report item (with rate limiting: 10/hour)
router.post('/:type', verifyToken, reportLimiter, validate(schemas.item), (req, res, next) => {
    console.log("📥 POST /:type route hit");
    next();
}, upload.single('image'), itemsController.createItem);

router.get('/detail/:id', itemsController.getItemById);
router.put('/:id/status', verifyToken, itemsController.updateItemStatus);

// Delete item (only owner can delete)
router.delete('/:id', verifyToken, itemsController.deleteItem);

module.exports = router;
