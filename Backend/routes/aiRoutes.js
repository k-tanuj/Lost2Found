const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/match', verifyToken, aiController.matchItem);
router.get('/:itemId', verifyToken, aiController.findMatchesForId);

module.exports = router;
