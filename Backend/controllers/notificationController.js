
const { db } = require('../firebase');

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { userId, type, title, message, itemId, relatedUserId } = req.body;

        const notification = {
            userId,           // User receiving the notification
            type,             // 'claim_request', 'match_found', etc.
            title,
            message,
            itemId,
            relatedUserId,    // Who triggered it (e.g. the finder)
            read: false,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('notifications').add(notification);
        res.status(201).json({ id: docRef.id, ...notification });

    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ error: "Failed to create notification" });
    }
};

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('notifications')
            .where('userId', '==', userId)
            .where('userId', '==', userId)
            // .orderBy('createdAt', 'desc') // Requires index, temporarily disabled for immediate fix
            .limit(20)
            .get();

        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
        });

        res.json(notifications);
    } catch (error) {
        console.error("Error getting notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('notifications').doc(id).update({ read: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Error marking notification read:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
};
