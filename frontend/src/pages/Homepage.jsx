import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';

export default function Homepage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // If not logged in, redirect to login
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full text-center"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Lost2Found
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Reuniting people with their belongings
                    </p>
                </motion.div>

                {/* Main Question */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-slate-900 dark:text-white mb-16"
                >
                    What happened?
                </motion.h2>

                {/* Two Large Buttons */}
                <div className="space-y-6 mb-12">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/report/lost')}
                        className="w-full py-8 px-8 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-bold text-2xl shadow-2xl shadow-red-500/30 transition-all flex items-center justify-center gap-4"
                    >
                        <Search className="w-8 h-8" />
                        I lost something
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/report/found')}
                        className="w-full py-8 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-bold text-2xl shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-4"
                    >
                        <Package className="w-8 h-8" />
                        I found something
                    </motion.button>
                </div>

                {/* Profile Link (Top Right) - Minimal Access Point */}
                <div className="absolute top-6 right-6">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
                        aria-label="Profile"
                    >
                        <img
                            src="/pfp.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
