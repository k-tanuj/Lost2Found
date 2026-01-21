const ITEM_STATUS = {
    REPORTED: 'REPORTED',
    MATCH_FOUND: 'MATCH_FOUND',
    CLAIM_REQUESTED: 'CLAIM_REQUESTED',
    VERIFIED: 'VERIFIED',
    RESOLVED: 'RESOLVED', // Final state: Item returned to owner
    SECURED: 'SECURED',   // Item secured at office/location
    REJECTED: 'REJECTED',
};

// Define allowed transitions for each state
const ALLOWED_TRANSITIONS = {
    [ITEM_STATUS.REPORTED]: [ITEM_STATUS.MATCH_FOUND, ITEM_STATUS.CLAIM_REQUESTED, ITEM_STATUS.RESOLVED, ITEM_STATUS.SECURED],
    [ITEM_STATUS.MATCH_FOUND]: [ITEM_STATUS.CLAIM_REQUESTED, ITEM_STATUS.REPORTED, ITEM_STATUS.RESOLVED, ITEM_STATUS.SECURED],
    [ITEM_STATUS.CLAIM_REQUESTED]: [ITEM_STATUS.VERIFIED, ITEM_STATUS.REJECTED, ITEM_STATUS.RESOLVED, ITEM_STATUS.SECURED],
    [ITEM_STATUS.VERIFIED]: [ITEM_STATUS.RESOLVED, ITEM_STATUS.REJECTED, ITEM_STATUS.SECURED],
    [ITEM_STATUS.REJECTED]: [ITEM_STATUS.REPORTED, ITEM_STATUS.RESOLVED, ITEM_STATUS.SECURED],
    [ITEM_STATUS.SECURED]: [ITEM_STATUS.RESOLVED, ITEM_STATUS.CLAIM_REQUESTED], // Can be resolved or claimed from secured state
    [ITEM_STATUS.RESOLVED]: [], // Terminal state
};

/**
 * Validates if a status transition is allowed.
 * @param {string} currentStatus - The current status of the item.
 * @param {string} nextStatus - The desired new status.
 * @returns {boolean} - True if transition is valid, false otherwise.
 */
const canTransition = (currentStatus, nextStatus) => {
    // 1. If status is undefined, assume REPORTED (initial state) for strictness
    const start = currentStatus || ITEM_STATUS.REPORTED;

    // 2. Direct lookup in allowed transitions
    if (ALLOWED_TRANSITIONS[start] && ALLOWED_TRANSITIONS[start].includes(nextStatus)) {
        return true;
    }

    return false;
};

/**
 * SINGLE SOURCE OF TRUTH for status transitions.
 * All status changes MUST go through this function.
 * 
 * @param {FirebaseFirestore.DocumentReference} itemRef - Reference to the item document
 * @param {string} currentStatus - Current status of the item
 * @param {string} newStatus - Desired new status
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional transaction context
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const transitionItemStatus = async (itemRef, currentStatus, newStatus, transaction = null) => {
    // 1. Validate transition
    if (!canTransition(currentStatus, newStatus)) {
        return {
            success: false,
            error: `Invalid transition from ${currentStatus} to ${newStatus}`
        };
    }

    // 2. Prepare update data
    const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
    };

    // Add terminal state markers
    if (newStatus === ITEM_STATUS.RESOLVED || newStatus === ITEM_STATUS.SECURED) {
        updateData.resolvedAt = new Date().toISOString();
    }

    // 3. Execute update (with or without transaction)
    try {
        if (transaction) {
            transaction.update(itemRef, updateData);
        } else {
            await itemRef.update(updateData);
        }
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: `Failed to update status: ${error.message}`
        };
    }
};

module.exports = { ITEM_STATUS, ALLOWED_TRANSITIONS, canTransition, transitionItemStatus };
