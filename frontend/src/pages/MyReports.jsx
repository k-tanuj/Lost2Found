import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserItems } from '../services/api';
import ItemCard from '../components/ItemCard';
import { ChevronLeft, FileText, PlusCircle, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyReports() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyItems = async () => {
            if (currentUser?.uid) {
                try {
                    const data = await getUserItems(currentUser.uid);
                    setItems(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } catch (error) {
                    console.error("Failed to fetch reports", error);
                }
            }
            setLoading(false);
        };
        fetchMyItems();
    }, [currentUser]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-6 flex items-center transition-colors group text-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3">
                                <Sparkles className="w-3 h-3" /> Historical Data
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Reports</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage all your lost and found submissions in one place.</p>
                        </div>
                        {items.length > 0 && (
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-500 dark:text-slate-400 shadow-sm">
                                    Total: <span className="text-indigo-600 dark:text-indigo-400">{items.length} Reports</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-2xl animate-spin"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Logs...</p>
                    </div>
                ) : items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xl shadow-slate-300/30 dark:shadow-none"
                    >
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-700 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No active cases</h2>
                        <p className="text-slate-500 dark:text-slate-500 mb-10 max-w-sm mx-auto font-medium">You haven't reported any lost or found items yet. Every report helps the community!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/report')}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 font-black transition-all flex items-center justify-center gap-3 mx-auto"
                        >
                            <PlusCircle className="w-5 h-5" /> Start First Report
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6"
                    >
                        {items.map((item) => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <ItemCard
                                    item={item}
                                    onClick={(clickedItem) => navigate(`/matches/${clickedItem.id}`)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
