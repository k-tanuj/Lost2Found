const admin = require('firebase-admin');

// ⚠️ Setup for Google Cloud Service Account
// Ideally, use: admin.credential.cert(serviceAccount)
// But for Free Tier Hackathon simplificiation (if key JSON is missing):
// We can use default credentials if deployed on Google Cloud, OR credentials from .env
// For now, let's assume the user has the credentials JSON path in .env or we use detailed env vars.

// Checking environment variables logic
// NOTE: User must provide GOOGLE_APPLICATION_CREDENTIALS path in .env
// OR populate individual fields.

const serviceAccount = require('./serviceAccountKey.json');

console.log("Initializing Firebase Admin with Service Account...");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lost2found-66698.appspot.com' // Explicit bucket for Hackathon
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { db, auth, storage, admin };
