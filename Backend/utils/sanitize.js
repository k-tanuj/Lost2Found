/**
 * Sanitizes text input by removing HTML tags, trimming whitespace,
 * and enforcing length limits.
 * 
 * @param {string} input - The text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized text
 */
const sanitizeText = (input, maxLength = 1000) => {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // 1. Trim whitespace
    let sanitized = input.trim();

    // 2. Remove HTML tags (basic XSS prevention)
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // 3. Escape special characters
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    // 4. Enforce length limit
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
};

module.exports = { sanitizeText };
