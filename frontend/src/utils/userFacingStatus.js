/**
 * Maps internal system statuses to user-friendly messages.
 * This ensures users never see technical terms like "CLAIM_REQUESTED" or "VERIFIED".
 * 
 * CRITICAL: These messages are designed for stressed, non-technical users.
 * They must be calm, reassuring, and use everyday language.
 * 
 * @param {string} systemStatus - The internal status from the backend
 * @param {object} itemData - Optional item data for context (e.g., claimantEmail)
 * @returns {string} - A plain-English message for the user
 */
export const getUserFacingStatus = (systemStatus, itemData = {}) => {
    const statusMap = {
        'REPORTED': "We're looking for your item.",
        'MATCH_FOUND': "Good news! We might have found a match.",
        'CLAIM_REQUESTED': "Someone thinks this is theirs. Review their proof.",
        'VERIFIED': "We connected you two. Please arrange a safe meet-up.",
        'RESOLVED': "This item has been safely returned.",
        'REJECTED': "That match didn't work out. We're still looking.",
        'SECURED': "This item is safe."
    };

    return statusMap[systemStatus] || "We're working on this.";
};

/**
 * Determines if the user needs to take action based on the item's status.
 * 
 * @param {string} systemStatus - The internal status
 * @param {string} userId - The current user's ID
 * @param {string} itemOwnerId - The item owner's ID
 * @returns {object} - { needsAction: boolean, actionText?: string }
 */
export const getUserAction = (systemStatus, userId, itemOwnerId) => {
    // Only the owner can review claims
    if (systemStatus === 'CLAIM_REQUESTED' && userId === itemOwnerId) {
        return {
            needsAction: true,
            actionText: "Review this"
        };
    }

    // No action needed for other statuses
    return { needsAction: false };
};
