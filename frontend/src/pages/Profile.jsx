import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { getUserItems } from '../services/api';
import { ITEM_STATUS } from '../constants/itemStatus';
import Navbar from '../components/Navbar';
import {
    ChevronLeft, Moon, Sun, LogOut, Package,
    CheckCircle2, ShieldCheck, Award, Zap, Camera, Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const notification = useNotification();
    const { theme, toggleTheme } = useTheme();
    const [stats, setStats] = useState({ lost: 0, found: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (currentUser) {
                try {
                    const items = await getUserItems(currentUser.uid);
                    setStats({
                        lost: items.filter(i => i.type === 'lost').length,
                        found: items.filter(i => i.type === 'found').length,
                        resolved: items.filter(i => i.status === ITEM_STATUS.RESOLVED || i.status === ITEM_STATUS.SECURED).length
                    });
                } catch (error) {
                    console.error("Failed to fetch profile stats");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStats();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to logout", error);
            notification.error("Something went wrong. Please try again in a moment.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Header Card */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-300/30 dark:shadow-none border border-slate-200 dark:border-slate-800"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5">
                            <Radar className="w-32 h-32" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-900/30 bg-white dark:bg-slate-800">
                                    <img
                                        src="/pfp.jpg"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                        {currentUser?.displayName || "Guest User"}
                                    </h1>
                                    <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase rounded-md tracking-widest">
                                        Verified
                                    </div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                    {currentUser?.email || "demo@lost2found.com"}
                                </p>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-bold">
                                        <ShieldCheck className="w-4 h-4" />
                                        Handover Pro
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-bold">
                                        <Award className="w-4 h-4" />
                                        Top Finder
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Lost Reports', value: stats.lost, icon: <Package className="w-5 h-5" />, bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
                            { label: 'Found Items', value: stats.found, icon: <CheckCircle2 className="w-5 h-5" />, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
                            { label: 'Safe Returns', value: stats.resolved, icon: <Zap className="w-5 h-5" />, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg shadow-slate-300/20 dark:shadow-none border border-slate-200 dark:border-slate-800"
                            >
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center mb-4`}>
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Hub */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quick Access</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/my-reports')}
                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <Package className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">My Reports</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">View your lost and found items</p>
                            </button>

                            <button
                                onClick={() => navigate('/browse')}
                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Browse Found Items</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Check if someone found your item</p>
                            </button>
                        </div>
                    </motion.div>

                    {/* Settings Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Settings & Preferences</h2>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-300/30 dark:shadow-none">
                            {/* Theme Toggle */}
                            <div
                                onClick={toggleTheme}
                                className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                                        {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
                                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                                                {theme === 'dark' ? 'Dark' : 'Light'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Tap anywhere to switch modes</p>
                                    </div>
                                </div>
                                <div
                                    className="relative w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full p-1 transition-colors"
                                >
                                    <motion.div
                                        animate={{ x: theme === 'dark' ? 24 : 0 }}
                                        className="w-6 h-6 bg-white dark:bg-indigo-400 rounded-full shadow-md"
                                    />
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full p-6 flex items-center gap-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group border-t border-slate-50 dark:border-slate-800"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <LogOut className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-red-600 dark:text-red-400">Sign Out</h3>
                                    <p className="text-xs text-red-400 dark:text-red-500/60 font-medium">End your current session securely</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
