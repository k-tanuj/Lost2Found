const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
// For hackathon: You will likely use a service account key file
// saved as 'serviceAccountKey.json' in this config folder.
// MAKE SURE TO ADD 'serviceAccountKey.json' to .gitignore!

try {
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log("Firebase Admin Initialized Successfully! 🔥");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
