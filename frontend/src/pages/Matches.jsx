import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getItemById, claimItem } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Package, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Matches() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const notification = useNotification();

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [claimProof, setClaimProof] = useState('');

    // Get matched items from notification data passed via navigation state
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const matchData = location.state?.matchedItems || [];

                if (matchData.length === 0) {
                    setLoading(false);
                    return;
                }

                // Fetch full item details for each match
                const matchedItemsDetails = await Promise.all(
                    matchData.map(async (match) => {
                        const item = await getItemById(match.id);
                        return {
                            ...item,
                            matchScore: match.score,
                            matchReason: match.reason
                        };
                    })
                );

                setMatches(matchedItemsDetails);
            } catch (error) {
                console.error('Failed to fetch matches:', error);
                notification.error('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [location.state, notification]);

    const handleClaim = async (itemId) => {
        if (!claimProof.trim()) {
            notification.error('Please provide proof explaining why this is yours');
            return;
        }

        try {
            await claimItem(itemId, '', claimProof);
            notification.success("Claim submitted! The owner will review it.");
            setClaimingId(null);
            setClaimProof('');
            // Remove claimed item from matches
            setMatches(matches.filter(m => m.id !== itemId));
        } catch (error) {
            notification.error(error.response?.data?.error || 'Failed to claim item');
        }
    };

    const dismissMatch = (itemId) => {
        setMatches(matches.filter(m => m.id !== itemId));
        notification.success('Match dismissed');
    };

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
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                            AI Found Matches
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Our AI found these items that might match yours
                    </p>
                </div>

                {/* Empty State */}
                {matches.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            No matches to show
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            All matches have been reviewed or dismissed
                        </p>
                        <button
                            onClick={() => navigate('/browse')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
                        >
                            Browse All Items
                        </button>
                    </motion.div>
                ) : (
                    /* Matches List */
                    <div className="space-y-6">
                        <AnimatePresence>
                            {matches.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-6 md:p-8">
                                        {/* Match Score Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-indigo-600" />
                                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                    {item.matchScore}% Match
                                                </span>
                                            </div>
                                            {item.matchReason && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                    {item.matchReason}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Image */}
                                            <div className="flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full md:w-40 h-40 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800"
                                                    />
                                                ) : (
                                                    <div className="w-full md:w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                                                        <Package className="w-16 h-16 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    📍 {item.locationText}
                                                </p>
                                                {item.description && (
                                                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                                                        {item.description}
                                                    </p>
                                                )}

                                                {/* Claim Form */}
                                                {claimingId === item.id ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-3"
                                                    >
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            Prove this is yours:
                                                        </p>
                                                        <textarea
                                                            value={claimProof}
                                                            onChange={(e) => setClaimProof(e.target.value)}
                                                            placeholder="Explain why this is your item..."
                                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setClaimingId(null);
                                                                    setClaimProof('');
                                                                }}
                                                                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleClaim(item.id)}
                                                                disabled={!claimProof.trim()}
                                                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all"
                                                            >
                                                                Submit Claim
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setClaimingId(item.id)}
                                                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                                        >
                                                            ✅ This is mine!
                                                        </button>
                                                        <button
                                                            onClick={() => dismissMatch(item.id)}
                                                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-2xl transition-all"
                                                        >
                                                            Not a match
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
