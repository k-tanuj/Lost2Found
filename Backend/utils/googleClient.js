const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Read service account key
// Read service account key
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT in googleClient:", e);
        process.exit(1);
    }
} else {
    try {
        const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } catch (e) {
        console.error("❌ No serviceAccountKey.json found and no ENV var set in googleClient.");
        process.exit(1);
    }
}

console.log("🔑 Service Account Email:", serviceAccount.client_email);
console.log("🔑 Project ID:", serviceAccount.project_id);

const SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets'
];

// Fix: Don't use replace on private_key, use it directly
const auth = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key, // Use directly without replace
    SCOPES
);

const drive = google.drive({ version: 'v3', auth });

module.exports = { drive, auth };
