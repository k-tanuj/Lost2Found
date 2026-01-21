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

module.exports = { ITEM_STATUS, ALLOWED_TRANSITIONS, canTransition };
