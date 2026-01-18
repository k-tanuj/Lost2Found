const admin = require('firebase-admin');

// ⚠️ Setup for Google Cloud Service Account
// Ideally, use: admin.credential.cert(serviceAccount)
// But for Free Tier Hackathon simplificiation (if key JSON is missing):
// We can use default credentials if deployed on Google Cloud, OR credentials from .env
// For now, let's assume the user has the credentials JSON path in .env or we use detailed env vars.

// Checking environment variables logic
// NOTE: User must provide GOOGLE_APPLICATION_CREDENTIALS path in .env
// OR populate individual fields.

console.log("Initializing Firebase Admin...");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        // Handle if the secret is passed as a string/JSON
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", e);
    }
} else {
    // Fallback for local dev if file exists (optional, or error out)
    try {
        serviceAccount = require('./serviceAccountKey.json');
    } catch (e) {
        console.warn("No serviceAccountKey.json found and no ENV var set.");
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'lost2found-66698.firebasestorage.app'
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { db, auth, storage, admin };
