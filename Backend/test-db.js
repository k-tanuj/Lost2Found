const { db } = require('./config/firebase');

async function testConnection() {
    console.log("Testing Firestore Connection...");
    try {
        // 1. Write a test document
        const docRef = await db.collection('test').add({
            message: "Hello from Lost2Found!",
            timestamp: new Date()
        });
        console.log("✅ API Success! Written document ID:", docRef.id);

        // 2. Read it back
        const doc = await docRef.get();
        console.log("✅ Read Verification:", doc.data());

        console.log("\n🎉 DATABASE IS WORKING! You are ready to code.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Database Error:", error.message);
        process.exit(1);
    }
}

testConnection();
