import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getItems, claimItem } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Search as SearchIcon, Package, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Browse() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const notification = useNotification();
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('found'); // found or lost
    const [claimingId, setClaimingId] = useState(null);
    const [claimProof, setClaimProof] = useState('');

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const data = await getItems('all');
                // Filter out user's own items
                const otherItems = data.filter(item => item.userId !== currentUser?.uid);
                setItems(otherItems);
                setFilteredItems(otherItems.filter(item => item.type === 'found'));
            } catch (error) {
                console.error("Failed to fetch items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllItems();
    }, [currentUser]);

    useEffect(() => {
        let result = items.filter(item => item.type === activeTab);

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(item =>
                item.title?.toLowerCase().includes(lowerQuery) ||
                item.description?.toLowerCase().includes(lowerQuery) ||
                item.locationText?.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredItems(result);
    }, [query, activeTab, items]);

    const handleClaim = async (itemId) => {
        if (!claimProof.trim()) {
            notification.error('Please provide proof explaining why this is yours');
            return;
        }

        try {
            await claimItem(itemId, claimProof);
            notification.success("Claim submitted! The owner will review it.");
            setClaimingId(null);
            setClaimProof('');
            // Refresh items
            const data = await getItems('all');
            const otherItems = data.filter(item => item.userId !== currentUser?.uid);
            setItems(otherItems);
        } catch (error) {
            notification.error(error.response?.data?.error || 'Failed to claim item');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Browse Items
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Find your lost item or help return found items
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('found')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${activeTab === 'found'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        🟢 Found Items
                        <span className="ml-2 text-sm opacity-75">
                            ({items.filter(i => i.type === 'found').length})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('lost')}
                        className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${activeTab === 'lost'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        🔴 Lost Items
                        <span className="ml-2 text-sm opacity-75">
                            ({items.filter(i => i.type === 'lost').length})
                        </span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or location..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {/* Image */}
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                                    ) : (
                                        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Package className="w-16 h-16 text-slate-400" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            📍 {item.locationText}
                                        </p>

                                        {/* Claim Button (only for found items) */}
                                        {activeTab === 'found' && claimingId !== item.id && (
                                            <button
                                                onClick={() => setClaimingId(item.id)}
                                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                            >
                                                ✅ This is mine!
                                            </button>
                                        )}

                                        {/* View Details (for lost items) */}
                                        {activeTab === 'lost' && (
                                            <button
                                                onClick={() => navigate(`/item/${item.id}`)}
                                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                            >
                                                View Details <ArrowRight className="w-5 h-5" />
                                            </button>
                                        )}

                                        {/* Claim Form */}
                                        {claimingId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 space-y-3"
                                            >
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Prove this is yours:
                                                </p>
                                                <textarea
                                                    value={claimProof}
                                                    onChange={(e) => setClaimProof(e.target.value)}
                                                    placeholder="I lost my blue wallet at the library yesterday. It has my student ID and credit card inside..."
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
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchIcon className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            No {activeTab} items found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {query ? 'Try adjusting your search' : `No ${activeTab} items reported yet`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
