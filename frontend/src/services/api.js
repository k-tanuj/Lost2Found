
import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to get Token
const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

// --- ITEMS ---

export const uploadImage = async (file) => {
    // This function is no longer needed - uploads are handled in reportItem
    console.log("Upload handled by backend");
    return null;
};

export const reportItem = async (itemData) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();
        let type = 'lost';

        if (itemData instanceof FormData) {
            type = itemData.get('type');
        } else {
            type = itemData.type;
        }

        const response = await axios.post(`${API_URL}/items/${type}`, itemData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error reporting item:", error.response?.data || error.message);
        throw error;
    }
};

export const getItems = async (type = 'found') => {
    try {
        const response = await axios.get(`${API_URL}/items/${type}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
};

// --- AI MATCHING ---

export const getMatches = async (itemId) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/ai/${itemId}`, config);
        return response.data;
    } catch (error) {
        console.error("Error getting matches:", error);
        return [];
    }
};

export const getItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/items/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching item details:", error);
        return null;
    }
};


export const updateItemStatus = async (itemId, status) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/items/${itemId}/status`, { status }, config);
        return response.data;
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const getUserItems = async (userId) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/items/user/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching user items:", error);
        return [];
    }
};

// --- NOTIFICATIONS ---

export const getUserNotifications = async (userId) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/notifications/user/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const createNotification = async (notifData) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/notifications`, notifData, config);
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

export const claimItem = async (itemId, message = "", proof = "") => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/items/claim`, { itemId, message, proof }, config);
        return response.data;
    } catch (error) {
        console.error("Error claiming item:", error);
        throw error;
    }
};

export const markNotificationRead = async (id) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/notifications/${id}/read`, {}, config);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

export const deleteItem = async (itemId) => {
    try {
        const config = await getAuthHeaders();
        const response = await axios.delete(`${API_URL}/items/${itemId}`, config);
        return response.data;
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};
