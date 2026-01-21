import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { useEffect, useState } from 'react';
import { getItems } from '../services/api';
import { Search, PlusCircle, HelpCircle, Hand, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems('all');
                setItems(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (err) {
                console.error("Failed to load items", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-slate-900 dark:bg-slate-900/50 pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto relative z-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles className="w-3 h-3" /> Community Network Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Welcome Back, <span className="text-indigo-400">{currentUser.displayName?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                        The AI network has matched <span className="text-white font-bold">{items.length}</span> items recently. What's your mission today?
                    </p>
                </motion.div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 pb-20">

                {/* Main Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <motion.button
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/report')}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-300/30 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col items-center group relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <HelpCircle className="w-24 h-24" />
                        </div>
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-red-100 dark:shadow-none">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-white">I Lost Something</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 group-hover:text-red-500 transition-colors">Start AI Search</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/report')}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-300/30 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col items-center group relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <PlusCircle className="w-24 h-24" />
                        </div>
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform shadow-lg shadow-emerald-100 dark:shadow-none">
                            <PlusCircle className="w-8 h-8" />
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-white">I Found Something</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 group-hover:text-emerald-500 transition-colors">Help Reunite</span>
                    </motion.button>
                </div>

                {/* Dashboard Feed */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl shadow-slate-300/30 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                <TrendingUp className="w-3 h-3" /> Live Feed
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Community Activity</h3>
                        </div>
                        <motion.button
                            whileHover={{ x: 5 }}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            View All Reports
                        </motion.button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Database...</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-6"
                        >
                            {items.length > 0 ? (
                                items.slice(0, 10).map((item) => (
                                    <motion.div key={item.id} variants={itemVariants}>
                                        <ItemCard
                                            item={item}
                                            onClick={(clickedItem) => navigate(`/matches/${clickedItem.id}`)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">All Quiet in the Network</h4>
                                    <p className="text-slate-500 dark:text-slate-500 max-w-xs mx-auto">No recent reports in your area. Everything seems to be right where it belongs!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
