const { db } = require('../config/firebase');

// Get all items (Lost or Found)
const getItems = async (req, res) => {
    const { type } = req.params; // 'lost' or 'found'
    try {
        const snapshot = await db.collection('items').where('type', '==', type).get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new item
const createItem = async (req, res) => {
    const { type } = req.params;
    const { title, description, location, imageUrl } = req.body;
    const userId = req.user.uid;

    try {
        const newItem = {
            title,
            description,
            location,
            imageUrl,
            type,
            userId,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('items').add(newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getItems, createItem };
