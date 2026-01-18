import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('/uploads/')) return url; // Relative path works in prod and dev (via proxy)
        if (url.includes('drive.google.com/thumbnail')) return url;
        if (url.includes('drive.google.com/uc')) {
            const idMatch = url.match(/id=([^&]+)/);
            if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
        }
        if (url.includes('drive.google.com/file/d/')) {
            const idMatch = url.match(/\/d\/([^\/]+)/);
            if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
        }
        return url;
    };

    const displayImage = getEmbedUrl(item.imageUrl);

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick && onClick(item)}
            className={`bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md hover:shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 flex items-center space-x-5 transition-all duration-300 cursor-pointer group relative overflow-hidden ${item.status === 'returned' ? 'border-emerald-500/50 dark:border-emerald-500/50 shadow-emerald-500/10' : ''}`}
        >
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>

            {/* Item Image */}
            <div className="h-24 w-24 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 relative z-10 shadow-inner">
                {displayImage ? (
                    <img src={displayImage} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="text-3xl group-hover:scale-110 transition-transform grayscale dark:invert">📦</div>
                )}
                <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter z-20 shadow-sm ${item.status === 'returned' ? 'bg-indigo-500 text-white' :
                    item.status === 'secured' ? 'bg-blue-500 text-white' :
                        item.status === 'CLAIMED' ? 'bg-amber-500 text-white' :
                            item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                    {item.status === 'returned' ? 'RETURNED' :
                        item.status === 'secured' ? 'SECURED' :
                            item.status === 'CLAIMED' ? 'PENDING' :
                                item.type}
                </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 z-10 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{item.category || 'Item'}</span>
                </div>

                <h4 className="text-lg font-black text-slate-900 dark:text-white truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium italic">
                    {item.description || "No specific details provided."}
                </p>

                <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/50">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                            {item.location || item.locationText || "Unknown Location"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Arrow */}
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </motion.div>
    );
}
