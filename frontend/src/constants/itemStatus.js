/**
 * INTERNAL STATUS CONSTANTS
 * 
 * ⚠️ WARNING: These are for BACKEND/SYSTEM USE ONLY
 * NEVER display these directly to users!
 * 
 * Always use getUserFacingStatus() from utils/userFacingStatus.js
 * to convert these to human-friendly messages.
 */
export const ITEM_STATUS = {
    REPORTED: 'REPORTED',
    MATCH_FOUND: 'MATCH_FOUND',
    CLAIM_REQUESTED: 'CLAIM_REQUESTED',
    VERIFIED: 'VERIFIED',
    RESOLVED: 'RESOLVED',
    SECURED: 'SECURED',
    REJECTED: 'REJECTED',
};
