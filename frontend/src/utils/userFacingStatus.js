/**
 * Maps internal system statuses to user-friendly messages.
 * This ensures users never see technical terms like "CLAIM_REQUESTED" or "VERIFIED".
 * 
 * @param {string} systemStatus - The internal status from the backend
 * @param {object} itemData - Optional item data for context (e.g., claimantEmail)
 * @returns {string} - A plain-English message for the user
 */
export const getUserFacingStatus = (systemStatus, itemData = {}) => {
    const statusMap = {
        'REPORTED': "We're still looking for your item.",
        'MATCH_FOUND': "We may have found your item. Checking now...",
        'CLAIM_REQUESTED': "Someone thinks this belongs to them. Please review their request.",
        'VERIFIED': itemData.claimantEmail
            ? `Match confirmed! Contact them at: ${itemData.claimantEmail}`
            : "Ownership confirmed. You can collect your item.",
        'RESOLVED': "This case is closed. Glad we could help!",
        'REJECTED': "The claim was not a match. We're still looking.",
        'SECURED': "This item is safely stored at the security office."
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
            actionText: "Review request"
        };
    }

    // No action needed for other statuses
    return { needsAction: false };
};
