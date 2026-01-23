const { db, storage, auth: adminAuth } = require('../firebase');
const { drive } = require('../utils/googleClient');
const cloudinary = require('../utils/cloudinary'); // Load Cloudinary config on startup
const stream = require('stream');
const axios = require('axios');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/email');
const { ITEM_STATUS, canTransition, transitionItemStatus } = require('../constants/itemStatus');
const { sanitizeText } = require('../utils/sanitize');

exports.getItems = async (req, res) => {
    try {
        const { type } = req.params; // 'lost' or 'found'

        let query = db.collection('items');

        if (type && type !== 'all') {
            query = query.where('type', '==', type);
        }

        const snapshot = await query.orderBy('date', 'desc').get();

        const items = [];
        snapshot.forEach(doc => {
            const itemData = { id: doc.id, ...doc.data() };
            // CRITICAL: Filter out RESOLVED items from public views
            // Resolved items should only appear in user's own reports
            if (itemData.status !== ITEM_STATUS.RESOLVED) {
                items.push(itemData);
            }
        });

        res.json(items);
    } catch (error) {
        console.error("Error getting items:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
};

exports.getUserItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('items')
            .where('userId', '==', userId)
            .get();

        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        res.json(items);
    } catch (error) {
        console.error("Error getting user items:", error);
        res.status(500).json({ error: "Failed to fetch user items" });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { type } = req.params;
        const { title, locationText } = req.body;

        // Sanitize inputs
        const sanitizedTitle = sanitizeText(title, 100);
        const sanitizedLocation = sanitizeText(locationText, 200);
        const sanitizedDescription = sanitizeText(req.body.description, 500);

        // Validation: Required Fields
        if (!sanitizedTitle) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!sanitizedLocation) {
            return res.status(400).json({ error: "Location is required" });
        }

        let imageUrl = req.body.imageUrl || '';


        // 1. Cloudinary Image Upload
        if (req.file) {
            try {
                const cloudinary = require('../utils/cloudinary');

                // Upload to Cloudinary using upload_stream
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'lost2found',
                            resource_type: 'auto',
                            transformation: [
                                { width: 1200, height: 1200, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });

                imageUrl = result.secure_url;

            } catch (err) {
                console.error("❌ Cloudinary Upload Error:", err.message);
                imageUrl = '';
            }
        }


        // 2. AI Image Analysis (Get Tags/Meta)
        let aiMetadata = {};
        if (req.file) {
            try {
                // Need to use 'axios' and 'form-data' for Node.js file upload
                const NodeFormData = require('form-data');
                const aiData = new NodeFormData();
                aiData.append('file', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

                const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'}/analyze-image`, aiData, {
                    headers: { ...aiData.getHeaders() }
                });

                aiMetadata = aiResponse.data; // { labels, category, description, colors }
                console.log("AI Analysis Result:", aiMetadata);

            } catch (aiErr) {
                console.error("AI Analysis Failed:", aiErr.message);
            }
        }

        const itemData = {
            type: type || req.body.type || 'lost',
            status: ITEM_STATUS.REPORTED, // FSM: Initial state
            title: sanitizedTitle,
            description: sanitizedDescription,
            locationText: sanitizedLocation,
            imageUrl: imageUrl,
            date: new Date().toISOString(),
            userId: req.user.uid,
            userEmail: req.user.email || 'Anonymous',
            userName: req.user.name || 'Anonymous',
            labels: aiMetadata.labels || [],
            colors: aiMetadata.colors || [],
            category: req.body.category || aiMetadata.category || 'Uncategorized',
        };

        const docRef = await db.collection('items').add(itemData);
        const newItemId = docRef.id;

        // AUTO AI MATCHING: Find similar items and notify user
        try {
            const aiController = require('./aiController');
            const candidateType = itemData.type === 'lost' ? 'found' : 'lost';

            // Fetch candidates (exclude RESOLVED items via client-side filter)
            const candidatesSnapshot = await db.collection('items')
                .where('type', '==', candidateType)
                .get();

            if (!candidatesSnapshot.empty) {
                const candidateItems = [];
                candidatesSnapshot.forEach(doc => {
                    const candidate = { id: doc.id, ...doc.data() };
                    // Filter out RESOLVED items
                    if (candidate.status !== ITEM_STATUS.RESOLVED) {
                        candidateItems.push(candidate);
                    }
                });

                // Call AI matching
                const axios = require('axios');
                const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

                const sanitizeItem = (item) => {
                    const newItem = { ...item };
                    if (newItem.date && typeof newItem.date.toDate === 'function') {
                        newItem.date = newItem.date.toDate().toISOString();
                    } else if (newItem.date instanceof Date) {
                        newItem.date = newItem.date.toISOString();
                    }
                    return newItem;
                };

                const payload = {
                    target_item: sanitizeItem({ id: newItemId, ...itemData }),
                    candidates: candidateItems.map(sanitizeItem)
                };

                const aiResponse = await axios.post(`${AI_SERVICE_URL}/match-items`, payload);
                const matches = aiResponse.data.filter(match => match.score >= 30); // Filter >=30%

                // Create notification if matches found
                if (matches.length > 0) {
                    const notifRef = db.collection('notifications').doc();
                    const notification = {
                        type: 'potential_match',
                        userId: req.user.uid,
                        title: `We found ${matches.length} possible match${matches.length > 1 ? 'es' : ''}!`,
                        message: `Your ${itemData.type} item "${itemData.title}" has ${matches.length} potential match${matches.length > 1 ? 'es' : ''}.`,
                        itemId: newItemId,
                        matchedItems: matches.map(m => ({
                            id: m.item_id,
                            score: m.score,
                            reason: m.reason
                        })),
                        read: false,
                        createdAt: new Date().toISOString()
                    };
                    await notifRef.set(notification);
                    console.log(`✅ Created match notification for user ${req.user.uid}: ${matches.length} matches`);
                }
            }
        } catch (aiError) {
            // Don't fail the request if AI matching fails
            console.error('AI Matching failed (non-critical):', aiError.message);
        }

        // Sheets logging removed per user request



        res.status(201).json({ success: true, item: { id: docRef.id, ...itemData } });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item" });
    }
}


exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('items').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Item not found" });
        }

        const itemData = { id: doc.id, ...doc.data() };

        // Generate QR Code for this item (using frontend URL)
        // Hugging Face exposes SPACE_HOST. If not set, use custom FRONTEND_URL or fallback to localhost
        const host = process.env.SPACE_HOST ? `https://${process.env.SPACE_HOST}` : (process.env.FRONTEND_URL || 'http://localhost:5173');
        const frontendUrl = `${host}/item/${id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(frontendUrl);
        itemData.qrCode = qrCodeDataUrl;

        res.json(itemData);
    } catch (error) {
        console.error("Error getting item:", error);
        res.status(500).json({ error: "Failed to fetch item" });
    }
};

exports.claimItem = async (req, res) => {
    const { itemId, message, proof } = req.body;
    const claimantId = req.user.uid;
    const claimantName = req.user.name || 'A user';
    const claimantEmail = req.user.email || 'Someone';

    // Sanitize inputs
    const sanitizedMessage = sanitizeText(message, 500);
    const sanitizedProof = sanitizeText(proof, 500);

    // Validation
    if (!itemId) return res.status(400).json({ error: "Item ID is required" });
    if (!sanitizedProof || sanitizedProof.trim().length === 0) {
        return res.status(400).json({ error: "Proof of ownership is required" });
    }

    try {
        // 1. Throttling: Check if user has too many active claims
        const activeClaimsSnapshot = await db.collection('notifications')
            .where('relatedUserId', '==', claimantId)
            .where('type', '==', 'claim_request')
            .where('read', '==', false)
            .get();

        if (activeClaimsSnapshot.size >= 5) {
            return res.status(403).json({ error: "Limit reached: You have 5 pending claim requests. Please resolve them first." });
        }

        const itemRef = db.collection('items').doc(itemId);

        const result = await db.runTransaction(async (t) => {
            const itemDoc = await t.get(itemRef);

            if (!itemDoc.exists) {
                throw new Error("Item not found");
            }

            const itemData = itemDoc.data();

            // 1. Prevent self-claim
            if (itemData.userId === claimantId) {
                throw new Error("You cannot claim your own item.");
            }

            // 2. FSM: Use transitionItemStatus for enforcement
            const currentStatus = itemData.status || ITEM_STATUS.REPORTED;
            const transitionResult = await transitionItemStatus(itemRef, currentStatus, ITEM_STATUS.CLAIM_REQUESTED, t);

            if (!transitionResult.success) {
                throw new Error(transitionResult.error);
            }

            // 4. Create Notification
            const notifRef = db.collection('notifications').doc();
            const notification = {
                userId: itemData.userId, // Notify owner
                type: 'CLAIM_REQUEST',
                title: 'Action Required: Item Claimed!',
                message: `${claimantName} wants to claim your "${itemData.title}".`,
                claimantProof: proof || "No additional proof provided.",
                claimantMessage: message || "",
                itemId: itemId,
                relatedUserId: claimantId,
                read: false,
                status: 'ACTION_REQUIRED',
                priority: 'HIGH',
                createdAt: new Date().toISOString()
            };
            t.set(notifRef, notification);

            return { itemData, notification };
        });

        // 5. Send Real Email Alert to the Item Owner
        try {
            const ownerUser = await adminAuth.getUser(result.itemData.userId);
            const ownerEmail = ownerUser.email;

            if (ownerEmail) {
                const subject = `🚀 Claim Request: ${result.itemData.title}`;
                const text = `Hello! Someone has claimed your item "${result.itemData.title}" on Lost2Found.`;
                const html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #4f46e5;">Good News!</h2>
                        <p>Hi there,</p>
                        <p><strong>${claimantName}</strong> has just submitted a claim request for your item: <strong>"${result.itemData.title}"</strong>.</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Claimant Message:</strong> ${message || 'No message provided.'}</p>
                            <p style="margin: 5px 0 0 0;"><strong>Claimant Email:</strong> ${claimantEmail}</p>
                        </div>
                        <p>Please log in to the app to review their proof and finalize the return.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/activity" 
                           style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                           Review Claim Request
                        </a>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Lost2Found System Notification</p>
                    </div>
                `;

                await sendEmail(ownerEmail, subject, text, html);
            }
        } catch (emailErr) {
            console.error("Failed to lookup owner or send email:", emailErr.message);
        }

        res.json({ success: true, message: "Claim request processed successfully" });

    } catch (error) {
        console.error("Claim Transaction Failed:", error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.updateItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active', 'claimed', 'returned', 'secured'

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const itemRef = db.collection('items').doc(id);
        const itemDoc = await itemRef.get();

        if (!itemDoc.exists) {
            return res.status(404).json({ error: "Item not found" });
        }

        const itemData = itemDoc.data();
        const currentStatus = itemData.status || ITEM_STATUS.REPORTED;

        // FSM: Use transitionItemStatus for enforcement
        const transitionResult = await transitionItemStatus(itemRef, currentStatus, status);

        if (!transitionResult.success) {
            return res.status(400).json({ error: transitionResult.error });
        }

        // If transitioning to VERIFIED, store claimant info from notification
        if (status === ITEM_STATUS.VERIFIED) {
            try {
                // Find the claim request notification to get claimant info
                const notifSnapshot = await db.collection('notifications')
                    .where('itemId', '==', id)
                    .where('type', '==', 'CLAIM_REQUEST')
                    .limit(1)
                    .get();

                if (!notifSnapshot.empty) {
                    const notifData = notifSnapshot.docs[0].data();
                    const claimantId = notifData.relatedUserId;

                    // Fetch claimant user details
                    const claimantUser = await adminAuth.getUser(claimantId);

                    // Store claimant info in item
                    await itemRef.update({
                        claimantId: claimantId,
                        claimantEmail: claimantUser.email,
                        claimantName: claimantUser.displayName || 'User'
                    });
                }
            } catch (err) {
                console.error("Failed to store claimant info:", err.message);
                // Don't fail the request if this fails
            }
        }

        // Notify Claimant via Email if item is resolved
        if ((status === ITEM_STATUS.RESOLVED) && itemData.claimantId) {
            try {
                const claimantUser = await adminAuth.getUser(itemData.claimantId);
                const claimantEmail = claimantUser.email;

                if (claimantEmail) {
                    const subject = `✨ Success! Your claim for "${itemData.title}" is ready`;
                    const html = `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #059669;">Great News!</h2>
                            <p>The owner of <strong>"${itemData.title}"</strong> has updated the status to: <strong style="text-transform: uppercase;">${status}</strong>.</p>
                            <p>This means your claim has been processed. If the item was "Secured at Office", you can now head there to collect it. If it was "Returned", we hope you're happy to have your item back!</p>
                            <p style="margin-top: 20px;">Thank you for using Lost2Found to foster a more honest community.</p>
                            <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Lost2Found System Notification</p>
                        </div>
                    `;
                    await sendEmail(claimantEmail, subject, `Your claim for ${itemData.title} is now ${status}!`, html);
                }
            } catch (err) {
                console.error("Failed to notify claimant:", err.message);
            }
        }

        res.json({ success: true, status });
    } catch (error) {
        console.error("Error updating item status:", error);
        res.status(500).json({ error: "Failed to update item status" });
    }
};

// NEW: Delete item endpoint
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const itemRef = db.collection('items').doc(id);
        const itemDoc = await itemRef.get();

        if (!itemDoc.exists) {
            return res.status(404).json({ error: "Item not found" });
        }

        const itemData = itemDoc.data();

        // Authorization: Only owner can delete
        if (itemData.userId !== userId) {
            return res.status(403).json({ error: "You can only delete your own reports" });
        }

        // Delete the item
        await itemRef.delete();

        // Optional: Delete related notifications
        const notificationsSnapshot = await db.collection('notifications')
            .where('itemId', '==', id)
            .get();

        const batch = db.batch();
        notificationsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        res.json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item" });
    }
};

module.exports = exports;
