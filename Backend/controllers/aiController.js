const axios = require('axios');
const { db } = require('../firebase');

// URL of the Python AI Service (Localhost for now)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

exports.matchItem = async (req, res) => {
    // Legacy pass-through (optional, can keep for debug)
    try {
        const { target_item, candidate_items } = req.body;
        const response = await axios.post(`${AI_SERVICE_URL}/match-items`, { target_item, candidate_items });
        res.json(response.data);
    } catch (error) {
        console.error("AI Proxy Error:", error.message);
        res.status(500).json({ error: "Failed to forward match request" });
    }
};

exports.findMatchesForId = async (req, res) => {
    try {
        const { itemId } = req.params;

        // 1. Fetch the Target Item
        const itemDoc = await db.collection('items').doc(itemId).get();
        if (!itemDoc.exists) {
            return res.status(404).json({ error: "Item not found" });
        }
        const targetItem = { id: itemDoc.id, ...itemDoc.data() };

        // 2. Determine Candidate Type (Lost -> Find Found, Found -> Find Lost)
        const candidateType = targetItem.type === 'lost' ? 'found' : 'lost';

        // 3. Fetch Candidates from Firestore
        const candidatesSnapshot = await db.collection('items')
            .where('type', '==', candidateType)
            .get();

        const candidateItems = [];
        candidatesSnapshot.forEach(doc => {
            const data = doc.data();
            // Filter out items that are already resolved or verified (taken)
            if (data.status !== 'RESOLVED' && data.status !== 'VERIFIED') {
                candidateItems.push({ id: doc.id, ...data });
            }
        });

        if (candidateItems.length === 0) {
            console.log(`No candidates found for type: ${candidateType}`);
            return res.json([]); // No candidates to match against
        }
        console.log(`Found ${candidateItems.length} candidates of type '${candidateType}' for matching.`);

        // Helper to sanitize Firestore data (dates, timestamps) for JSON
        const sanitizeItem = (item) => {
            const newItem = { ...item };
            // Convert Date objects or Firestore Timestamps to strings
            if (newItem.date && typeof newItem.date.toDate === 'function') {
                newItem.date = newItem.date.toDate().toISOString();
            } else if (newItem.date instanceof Date) {
                newItem.date = newItem.date.toISOString();
            }
            // Ensure numbers are numbers, strings are strings (basic cleanup)
            return newItem;
        };

        const cleanTarget = sanitizeItem(targetItem);
        const cleanCandidates = candidateItems.map(sanitizeItem);

        // 4. Call Python AI Service
        // Python expects: { target_item: {...}, candidates: [...] }
        // FIX: Field name must match Pydantic model 'candidates'
        const payload = {
            target_item: cleanTarget,
            candidates: cleanCandidates
        };
        console.log("Sending AI Payload:", JSON.stringify(payload, null, 2));

        const aiResponse = await axios.post(`${AI_SERVICE_URL}/match-items`, payload);

        // 5. Merge AI Results with Item Details
        const aiResults = aiResponse.data; // List of { item_id, score, reason }

        const enrichedMatches = aiResults.map(match => {
            const original = candidateItems.find(item => item.id === match.item_id);
            return {
                ...original,
                matchScore: match.score,
                matchReason: match.reason
            };
        });

        res.json(enrichedMatches);

    } catch (error) {
        console.error("Smart Match Error:", error.message);
        if (error.response) {
            console.error("AI Response Status:", error.response.status);
            console.error("AI Response Data:", JSON.stringify(error.response.data, null, 2));
        }
        // Fallback: If AI fails, return empty list (or handle gracefully)
        res.status(500).json({ error: "Matching Service Failed" });
    }
};
