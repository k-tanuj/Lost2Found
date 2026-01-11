// MOCK API SERVICE FOR DEMO
// Since we don't have a real backend or Firebase Storage active yet

// Simulate Upload Image to Firebase Storage
export const uploadImage = async (file) => {
    console.log("Mock Uploading:", file.name);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return a fake URL or the local object URL for preview
            resolve(URL.createObjectURL(file));
        }, 1000);
    });
};

// Simulate Report an Item
export const reportItem = async (itemData) => {
    console.log("Mock Reporting Item:", itemData);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, id: Math.floor(Math.random() * 1000) });
        }, 1000);
    });
};

// Simulate Get All Items
export const getItems = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Wallet",
                    description: "Found at Library",
                    location: "Library",
                    date: "10 mins ago",
                    type: "found",
                    imageUrl: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=100&auto=format&fit=crop"
                },
                {
                    id: 2,
                    title: "Keys",
                    description: "Found Near Cafeteria",
                    location: "Cafeteria",
                    date: "25 mins ago",
                    type: "found",
                    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=100&auto=format&fit=crop"
                },
                {
                    id: 3,
                    title: "Water Bottle",
                    description: "Found at Gym",
                    location: "Gym",
                    date: "30 mins ago",
                    type: "found",
                    imageUrl: "https://images.unsplash.com/photo-1602143407151-1111d30e8748?q=80&w=100&auto=format&fit=crop"
                }
            ]);
        }, 500);
    });
};

// Simulate Get Matches
export const getMatches = async (itemId) => {
    console.log("Mock Getting Matches for:", itemId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]);
        }, 1000);
    });
};
