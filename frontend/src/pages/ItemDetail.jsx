import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItemStatus, claimItem, getMatches } from '../services/api';
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
    const [matches, setMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [claimProof, setClaimProof] = useState('');

    useEffect(() => {
        const fetchItemAndMatches = async () => {
            setLoading(true);
            setMatches([]);
            try {
                const data = await getItemById(id);
                setItem(data);

                // If current user is owner and data exists, fetch matches
                if (data && currentUser && data.userId === currentUser.uid) {
                    setMatchesLoading(true);
                    try {
                        const matchData = await getMatches(id);
                        setMatches(matchData);
                    } catch (err) {
                        console.error("Failed to fetch matches", err);
                    } finally {
                        setMatchesLoading(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch item", error);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        if (id && currentUser) {
            fetchItemAndMatches();
        }
    }, [id, currentUser]);

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

    const handleMarkResolved = async () => {
        setActionLoading(true);
        try {
            await updateItemStatus(item.id, ITEM_STATUS.RESOLVED);
            notification.success("Item marked as resolved!");
            const updatedItem = await getItemById(id);
            setItem(updatedItem);
        } catch (error) {
            notification.error("Failed to mark as resolved");
        } finally {
            setActionLoading(false);
        }
    };

    const handleClaim = async () => {
        setActionLoading(true);
        try {
            await claimItem(item.id, '', claimProof);
            notification.success("Claim submitted! The owner will review it.");
            setShowClaimForm(false);
            setClaimProof('');
            navigate('/my-reports');
        } catch (error) {
            notification.error(error.response?.data?.error || "Failed to submit claim");
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
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-3 border-slate-900 dark:border-slate-700 p-8 md:p-12"
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
                                        "{item.claimantProof || "No additional proof provided."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decision Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <XCircle className="w-5 h-5" /> No, this isn't theirs
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
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
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-3 border-slate-900 dark:border-slate-700 p-8 md:p-12"
                    >
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover rounded-2xl mb-8 bg-slate-100 dark:bg-slate-800" />
                        )}

                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h1>

                        {/* RESOLVED Item - Closure Message */}
                        {item.status === 'RESOLVED' && (
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-500 mb-8">
                                <h3 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                                    ✅ This case is closed
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    This item has been successfully returned. No further action is needed.
                                </p>
                            </div>
                        )}

                        {/* User-Facing Status */}
                        <p className="text-xl text-slate-700 dark:text-slate-300 font-medium mb-8">
                            {userStatus}
                        </p>

                        <div className="space-y-4 text-slate-600 dark:text-slate-400">
                            <p><strong>Location:</strong> {item.locationText}</p>
                            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                            <p><strong>Type:</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.type}</span></p>
                        </div>

                        {/* Claim Button for Non-Owners */}
                        {!isOwner && item.status !== 'RESOLVED' && item.status !== 'VERIFIED' && (
                            <div className="mt-8">
                                {!showClaimForm ? (
                                    <button
                                        onClick={() => setShowClaimForm(true)}
                                        className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg">
                                        {item.type === 'lost' ? '✅ I have this!' : '✅ This is mine!'}
                                    </button>
                                ) : (
                                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-teal-500">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                                            {item.type === 'lost' ? 'Confirm you have this item' : 'Prove this is yours'}
                                        </h3>
                                        <textarea
                                            value={claimProof}
                                            onChange={(e) => setClaimProof(e.target.value)}
                                            placeholder={item.type === 'lost'
                                                ? "Describe where you found it and any unique details..."
                                                : "Describe something unique about this item that proves it's yours..."}
                                            className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-4"
                                            rows="4"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setShowClaimForm(false);
                                                    setClaimProof('');
                                                }}
                                                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleClaim}
                                                disabled={!claimProof.trim() || actionLoading}
                                                className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all">
                                                {actionLoading ? 'Submitting...' : item.type === 'lost' ? 'Notify Owner' : 'Submit Claim'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Matches Section for Owner */}
                        {isOwner && (
                            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Potential Matches</h2>
                                {matchesLoading ? (
                                    <p className="text-slate-500">Searching for matches...</p>
                                ) : matches.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {matches.map(match => (
                                            <div key={match.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                                                <div className="flex gap-4 mb-4">
                                                    {match.imageUrl && (
                                                        <img src={match.imageUrl} alt={match.title} className="w-20 h-20 object-cover rounded-lg bg-slate-200" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white">{match.title}</h3>
                                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${match.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {match.type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/item/${match.id}`)}
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-sm"
                                                >
                                                    View & Claim
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No matches found yet. We'll notify you if we find something!</p>
                                )}
                            </div>
                        )}

                        {/* Contact Info for Verified Items */}
                        {(item.status === 'VERIFIED' || item.status === 'RESOLVED') && (
                            <div className="mt-8 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border-2 border-teal-500">
                                <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-4">🎉 It's a Match! Connect now</h3>
                                <div className="space-y-4">
                                    {isOwner ? (
                                        // Owner sees Claimant info
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-teal-100 dark:border-teal-800">
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Contact the finder</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{item.claimantName || 'User'}</p>
                                            <a href={`mailto:${item.claimantEmail}`} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-2 mt-1">
                                                {item.claimantEmail}
                                            </a>
                                        </div>
                                    ) : (
                                        // Claimant sees Owner info
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-teal-100 dark:border-teal-800">
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Contact the owner</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{item.userName || 'User'}</p>
                                            <a href={`mailto:${item.userEmail}`} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-2 mt-1">
                                                {item.userEmail}
                                            </a>
                                        </div>
                                    )}
                                    <p className="text-sm text-slate-500 text-center mt-4">
                                        Please arrange a safe meet-up to return the item.
                                        {item.status !== 'RESOLVED' && " Click below to close the case after exchange."}
                                    </p>

                                    {/* Show Resolve Button for Owner OR Verified Claimant */}
                                    {(isOwner || (currentUser && item.claimantId === currentUser.uid)) && item.status !== 'RESOLVED' && (
                                        <button
                                            onClick={handleMarkResolved}
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Mark as Resolved & Returned
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
