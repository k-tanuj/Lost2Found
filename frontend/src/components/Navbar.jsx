import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Radar, LogOut, User, Moon, Sun } from 'lucide-react';
import NotificationBell from './NotificationBell';
import ActionBanner from './ActionBanner';
import BottomNav from './BottomNav';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <>
            {currentUser && <ActionBanner count={actionCount} />}
            <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-2xl sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-12">
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center cursor-pointer group"
                            >
                                <div className="bg-white p-2 rounded-[14px] mr-3 group-hover:bg-slate-50 transition-colors shadow-lg shadow-slate-200/50 w-12 h-12 flex items-center justify-center overflow-hidden">
                                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain transition-transform group-hover:scale-125 scale-[1.8]" />
                                </div>
                                <span className="text-slate-900 dark:text-white text-2xl font-black tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Lost2Found</span>
                            </motion.div>

                            {/* Desktop Links */}
                            {currentUser && (
                                <div className="hidden md:flex items-center gap-2">
                                    {[
                                        { name: 'Home', path: '/home' },
                                        { name: 'Browse Items', path: '/browse' },
                                        { name: 'My Reports', path: '/my-reports' },
                                        { name: 'Profile', path: '/profile' }
                                    ].map((link) => (
                                        <button
                                            key={link.name}
                                            onClick={() => navigate(link.path)}
                                            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            {link.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-6">
                            {currentUser && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={toggleTheme}
                                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                        </button>
                                        <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block"></div>
                                        <NotificationBell />
                                    </div>

                                    <div className="flex items-center gap-4 pl-2">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-slate-900 dark:text-white text-sm font-black truncate max-w-[120px] leading-tight">{currentUser.displayName || 'Guest'}</span>
                                            <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">Active Member</span>
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
            </nav >
            {currentUser && (
                <div className="md:hidden">
                    <BottomNav />
                </div>
            )
            }
        </>
    );
}
