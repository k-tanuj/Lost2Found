import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login with Google
    const login = () => {
        return signInWithPopup(auth, googleProvider);
    };

    // Guest Login (Bypass for Demo)
    const loginAsGuest = () => {
        const guestUser = {
            uid: "guest-123",
            displayName: "Guest User",
            email: "guest@lost2found.com",
            photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
        };
        setCurrentUser(guestUser);
        setLoading(false);
        return Promise.resolve(guestUser);
    };

    // Logout
    const logout = () => {
        return signOut(auth).catch(() => setCurrentUser(null));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        currentUser,
        login,
        loginAsGuest,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
