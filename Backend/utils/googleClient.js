const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Read service account key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

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
