import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserItems, updateItemStatus } from '../services/api';
import { ITEM_STATUS } from '../constants/itemStatus';
import Navbar from '../components/Navbar';
import {
    Package, CheckCircle, Shield, Clock, AlertCircle,
    MapPin, Calendar, User, QrCode, ArrowRight, Activity as ActivityIcon, Sparkles
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Activity() {
    const { currentUser } = useAuth();
    const notification = useNotification();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewItem, setReviewItem] = useState(null); // Item being reviewed by owner

    useEffect(() => {
        const fetchItems = async () => {
            if (currentUser) {
                try {
                    const data = await getUserItems(currentUser.uid);
                    setItems(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } catch (error) {
                    console.error("Failed to fetch activity", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchItems();
    }, [currentUser]);

    const handleStatusUpdate = async (itemId, newStatus) => {
        try {
            await updateItemStatus(itemId, newStatus);
            setItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, status: newStatus } : item
            ));
            notification.success(`Item marked as ${newStatus}`);
        } catch (error) {
            notification.error("Failed to update status");
        }
    };

    const getStateHint = (item, stepStatus) => {
        if (stepStatus === 'Reported') return "Live: Systems Scanning";
        if (stepStatus === 'Claimed') {
            if (item.status === ITEM_STATUS.REPORTED) return "Action: Wait for Match";
            if (item.status === ITEM_STATUS.MATCH_FOUND) return "Action: Review Matches";
            if (item.status === ITEM_STATUS.CLAIM_REQUESTED) return "Action: Verify Claimant";
            return "In Verification";
        }
        if (stepStatus === 'Resolved') {
            if (item.status === ITEM_STATUS.RESOLVED || item.status === ITEM_STATUS.SECURED) return "Complete: Secure & Closed";
            return "Goal: Handover";
        }
        return null;
    };

    const TimelineStep = ({ label, active, completed, last, hint }) => (
        <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-500
                    ${completed ? 'bg-indigo-600 border-indigo-600 text-white' :
                        active ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-600 text-indigo-600 animate-pulse' :
                            'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'}`}>
                    {completed ? <CheckCircle className="w-5 h-5 shadow-lg shadow-indigo-500/50" /> :
                        active ? <Clock className="w-5 h-5" /> :
                            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />}
                </div>
                {!last && <div className={`w-0.5 flex-1 my-1 rounded-full ${completed ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
            <div className="pb-10 pt-1">
                <div className="flex items-center gap-3">
                    <h4 className={`font-black tracking-tight ${completed || active ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 text-sm'}`}>{label}</h4>
                    {hint && (active || completed) && (
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${active ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {hint}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-12 relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-600 rounded-full"></div>
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-3">
                        <ActivityIcon className="w-4 h-4" /> Personal Hub
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Activity</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 italic">Track the lifecycle of your reported items in real-time.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-2xl animate-spin"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
                    </div>
                ) : items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 px-12 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-300/30 dark:shadow-none max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                            <Package className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Quiet for now</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Your recovery journey hasn't started yet. Items you report will appear here with a detailed AI-tracked lifecycle.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-12"
                    >
                        {items.map(item => (
                            <motion.div
                                key={item.id}
                                variants={cardVariants}
                                className="group bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl shadow-slate-300/30 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-indigo-500/10"
                            >
                                <div className="flex flex-col lg:grid lg:grid-cols-12">
                                    {/* Left: Metadata */}
                                    <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                            <Sparkles className="w-32 h-32" />
                                        </div>

                                        <div className="relative aspect-square rounded-[32px] bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700 mb-8 shadow-inner z-10">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                                                    <Package className="w-16 h-16" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <div className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                    {item.type}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">{item.description}</p>

                                            <div className="flex flex-wrap gap-4 pt-4">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                    <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    <Package className="w-3 h-3" /> {item.category}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Timeline & Flow */}
                                    <div className="lg:col-span-8 p-10 md:p-14 bg-white dark:bg-slate-900">
                                        <div className="grid md:grid-cols-2 gap-12 h-full">
                                            <div>
                                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                                                    <Clock className="w-3 h-3" /> Intelligence Logs
                                                </div>
                                                <div className="space-y-0">
                                                    <TimelineStep label="Report Broadcast" completed={true} hint={getStateHint(item, 'Reported')} />
                                                    <TimelineStep
                                                        label="Claim Processing"
                                                        active={item.status === ITEM_STATUS.REPORTED}
                                                        completed={item.status !== ITEM_STATUS.REPORTED}
                                                        hint={getStateHint(item, 'Claimed')}
                                                    />
                                                    <TimelineStep
                                                        label="Handover Resolved"
                                                        active={item.status === ITEM_STATUS.CLAIM_REQUESTED}
                                                        completed={item.status === ITEM_STATUS.RESOLVED || item.status === ITEM_STATUS.SECURED}
                                                        hint={getStateHint(item, 'Resolved')}
                                                        last={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                                                        <QrCode className="w-3 h-3" /> Digital Passport
                                                    </div>
                                                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 flex items-center justify-center group/qr relative overflow-hidden">
                                                        <div className="relative z-10 p-4 bg-white rounded-2xl shadow-xl transition-transform duration-500 group-hover/qr:scale-110">
                                                            <img src={item.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/item/${item.id}`} alt="QR" className="w-24 h-24" />
                                                        </div>
                                                        <p className="absolute bottom-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure Verification ID</p>
                                                    </div>
                                                </div>

                                                <div className="pt-8">
                                                    {/* CLAIM REVIEW ACTION */}
                                                    {item.status === ITEM_STATUS.CLAIM_REQUESTED && (
                                                        <button
                                                            onClick={() => setReviewItem(item)}
                                                            className="w-full mb-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all hover:translate-x-1 shadow-lg shadow-indigo-600/20 flex items-center justify-between"
                                                        >
                                                            <span>Review Claim Request</span>
                                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                                                <Shield className="w-4 h-4" />
                                                            </div>
                                                        </button>
                                                    )}

                                                    {item.status !== ITEM_STATUS.RESOLVED && item.status !== ITEM_STATUS.SECURED ? (
                                                        <div className="space-y-3">
                                                            <button
                                                                onClick={() => handleStatusUpdate(item.id, ITEM_STATUS.RESOLVED)}
                                                                className="w-full flex items-center justify-between px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all hover:translate-x-1 shadow-lg shadow-emerald-600/20"
                                                            >
                                                                Confirm Return <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(item.id, ITEM_STATUS.SECURED)}
                                                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                                            >
                                                                Secure at Security Office
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </div>
                                                                <h5 className="font-black text-emerald-900 dark:text-emerald-400">Mission Accomplished</h5>
                                                            </div>
                                                            <p className="text-xs text-emerald-700 dark:text-emerald-600/80 font-medium leading-relaxed">This item was successfully returned via secure handover. Database entry locked.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
            {/* CLAIM REVIEW MODAL */}
            <AnimatePresence>
                {reviewItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setReviewItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 pb-0">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Verify Claim</h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                    Someone wants to claim your item <strong>"{reviewItem.title}"</strong>. Review their proof below. Only approve if you are 100% sure.
                                </p>

                                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                                    {/* In a real app, we'd fetch the specific claim notification content here or pass it along. 
                                        For now, we simulate the review data structure as we don't store claims on the item doc itself yet (besides claimantId).
                                        To make this perfect, we'd need to fetch the 'claim_request' notification for this item.
                                        But for UI UX flow demonstration: */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Claimant Message</p>
                                        <p className="text-slate-800 dark:text-slate-200 text-sm italic">"Hello, I believe this is mine. I lost it at the library last Tuesday. It has a scratch on the back."</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provided Proof</p>
                                        <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3" /> Proof of Ownership details attached
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(reviewItem.id, ITEM_STATUS.REJECTED) && setReviewItem(null)}
                                    className="py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" /> Reject Claim
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(reviewItem.id, ITEM_STATUS.VERIFIED) && setReviewItem(null)}
                                    className="py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" /> Approve & Verify
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
