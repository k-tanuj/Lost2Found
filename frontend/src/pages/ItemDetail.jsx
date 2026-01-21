import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/api';
import { ITEM_STATUS } from '../constants/itemStatus';
import Navbar from '../components/Navbar';
import { Package, MapPin, Calendar, QrCode, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Digital ID...</p>
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
                <p className="text-slate-500 mb-8 max-w-sm">This ID does not match any active records in our secure database.</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Return Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="max-w-2xl mx-auto px-6 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Secure Header */}
                    <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-30"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-white shadow-inner">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-1">Official Digital Record</h2>
                            <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] text-white font-bold backdrop-blur-sm">
                                ID: {item.id}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Status Badge */}
                        <div className="flex justify-center -mt-16 mb-8 relative z-20">
                            <div className={`px-6 py-3 rounded-2xl shadow-xl font-black uppercase tracking-widest text-sm flex items-center gap-3
                                ${item.status === ITEM_STATUS.RESOLVED ? 'bg-emerald-500 text-white' :
                                    item.status === ITEM_STATUS.SECURED ? 'bg-blue-500 text-white' :
                                        'bg-white text-slate-800 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'}`}>
                                {item.status === ITEM_STATUS.RESOLVED && <CheckCircle className="w-5 h-5" />}
                                {item.status || 'Active'}
                            </div>
                        </div>

                        {/* Image */}
                        {item.imageUrl && (
                            <div className="aspect-square w-full bg-slate-50 dark:bg-slate-805 rounded-3xl overflow-hidden mb-10 shadow-inner border border-slate-100 dark:border-slate-800">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white text-center mb-6 leading-tight">{item.title}</h1>

                        <div className="space-y-4 max-w-sm mx-auto">
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="font-medium">{item.location || item.locationText}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="font-medium">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <Package className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="font-medium capitalize">{item.category} • {item.type}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">ID</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Reported By</span>
                                    <span className="font-mono text-xs select-all text-indigo-600 dark:text-indigo-400 font-bold">
                                        {item.userEmail || item.userId || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
                                This is a verified record from the Lost2Found network. Use this page to verify ownership during physical handover.
                            </p>
                            {(item.status === ITEM_STATUS.RESOLVED || item.status === ITEM_STATUS.SECURED) ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
                                    <ShieldCheck className="w-4 h-4" /> Secure Chain of Custody Verified
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold">
                                    <QrCode className="w-4 h-4" /> Active for Verification
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
