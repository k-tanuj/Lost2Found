import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItemStatus } from '../services/api';
import { ITEM_STATUS } from '../constants/itemStatus';
import { getUserFacingStatus } from '../utils/userFacingStatus';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import { Package, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const notification = useNotification();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItemById(id);
                setItem(data);
            } catch (error) {
                console.error("Failed to fetch item", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-2xl animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
                    <Package className="w-12 h-12 text-slate-400" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Item Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-sm">This item doesn't exist or has been removed.</p>
                <button onClick={() => navigate('/home')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Return Home</button>
            </div>
        );
    }

    const isOwner = currentUser && item.userId === currentUser.uid;
    const needsReview = item.status === ITEM_STATUS.CLAIM_REQUESTED && isOwner;
    const userStatus = getUserFacingStatus(item.status);

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await updateItemStatus(item.id, ITEM_STATUS.VERIFIED);
            notification.success("Confirmed. We've notified them.");
            navigate('/my-reports');
        } catch (error) {
            notification.error("Failed to approve claim");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await updateItemStatus(item.id, ITEM_STATUS.REJECTED);
            notification.success("Claim rejected. We'll keep looking.");
            navigate('/my-reports');
        } catch (error) {
            notification.error("Failed to reject claim");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-colors font-bold">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Claim Review (Owner Only) */}
                {needsReview ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 md:p-12"
                    >
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center">
                            Does this belong to them?
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center mb-12">
                            Review the information carefully before deciding
                        </p>

                        {/* Side-by-Side Comparison */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {/* Your Item */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Your item</h3>
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800" />
                                )}
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.locationText}</p>
                                </div>
                            </div>

                            {/* Their Proof */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Their proof</h3>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 h-full flex items-center">
                                    <p className="text-slate-700 dark:text-slate-300 italic">
                                        "I believe this is mine. I lost it at the {item.locationText} on {new Date(item.date).toLocaleDateString()}."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decision Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <XCircle className="w-5 h-5" /> No, this isn't theirs
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle className="w-5 h-5" /> Yes, this is theirs
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* Regular Item View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 md:p-12"
                    >
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover rounded-2xl mb-8 bg-slate-100 dark:bg-slate-800" />
                        )}

                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h1>

                        {/* User-Facing Status */}
                        <p className="text-xl text-slate-700 dark:text-slate-300 font-medium mb-8">
                            {userStatus}
                        </p>

                        <div className="space-y-4 text-slate-600 dark:text-slate-400">
                            <p><strong>Location:</strong> {item.locationText}</p>
                            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                            <p><strong>Type:</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.type}</span></p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
