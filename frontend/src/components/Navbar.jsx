import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ActionBanner from './ActionBanner';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [actionCount, setActionCount] = useState(0);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid),
            where("status", "==", "ACTION_REQUIRED"),
            where("read", "==", false)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setActionCount(snapshot.size);
        });
        return () => unsubscribe();
    }, [currentUser]);

    return (
        <>
            {currentUser && <ActionBanner count={actionCount} />}
            <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-2xl sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/home')}
                                className="flex items-center cursor-pointer group"
                            >
                                <div className="bg-white p-2 rounded-[14px] mr-3 group-hover:bg-slate-50 transition-colors shadow-lg shadow-slate-200/50 w-12 h-12 flex items-center justify-center overflow-hidden">
                                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain transition-transform group-hover:scale-125 scale-[1.8]" />
                                </div>
                                <span className="text-slate-900 dark:text-white text-2xl font-black tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Lost2Found</span>
                            </motion.div>
                        </div>

                        <div className="flex items-center space-x-6">
                            {currentUser && (
                                <>
                                    <NotificationBell />

                                    <div className="flex items-center gap-4 pl-2">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-slate-900 dark:text-white text-sm font-black truncate max-w-[120px] leading-tight">{currentUser.displayName || 'User'}</span>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => navigate('/profile')}
                                            className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-[14px] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-800 cursor-pointer overflow-hidden"
                                        >
                                            <img
                                                src="/pfp.jpg"
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
