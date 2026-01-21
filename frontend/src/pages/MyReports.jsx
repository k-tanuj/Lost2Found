import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserItems } from '../services/api';
import { getUserFacingStatus, getUserAction } from '../utils/userFacingStatus';
import { motion } from 'framer-motion';
import { Package, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MyReports() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            if (currentUser) {
                try {
                    const data = await getUserItems(currentUser.uid);
                    setItems(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } catch (error) {
                    console.error("Failed to fetch items", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchItems();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        My Reports
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Track your lost and found items
                    </p>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            You haven't reported anything yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Report a lost or found item to get started
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/report/lost')}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all"
                            >
                                Report a lost item
                            </button>
                            <button
                                onClick={() => navigate('/report/found')}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all"
                            >
                                Report a found item
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* Items List */
                    <div className="space-y-6">
                        {items.map((item, index) => {
                            const userStatus = getUserFacingStatus(item.status, item);
                            const action = getUserAction(item.status, currentUser.uid, item.userId);
                            const isVerified = item.status === 'VERIFIED';

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full md:w-32 h-32 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800"
                                                />
                                            ) : (
                                                <div className="w-full md:w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-slate-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title & Type Badge */}
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {item.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.type === 'lost'
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>

                                            {/* User-Facing Status (Plain English) */}
                                            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-4">
                                                {userStatus}
                                            </p>

                                            {/* What you need to do */}
                                            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">
                                                    👉 What you need to do:
                                                </p>
                                                {action.needsAction ? (
                                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                                        Review their claim and decide if this item belongs to them.
                                                    </p>
                                                ) : isVerified ? (
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                                            Arrange pickup/handoff with the other party.
                                                        </p>
                                                        {item.claimantEmail && (
                                                            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                                                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">Contact Information:</p>
                                                                <a href={`mailto:${item.claimantEmail}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                                                    {item.claimantEmail}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {item.userEmail && item.userId !== currentUser.uid && (
                                                            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                                                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">Owner's Contact:</p>
                                                                <a href={`mailto:${item.userEmail}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                                                    {item.userEmail}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                                        Nothing! We'll notify you if we find a match.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Button (Max ONE, or none) */}
                                            {action.needsAction ? (
                                                <button
                                                    onClick={() => navigate(`/item/${item.id}`)}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
                                                >
                                                    {action.actionText} <ArrowRight className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/browse')}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-2xl transition-all"
                                                >
                                                    Browse Similar Items <ArrowRight className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
