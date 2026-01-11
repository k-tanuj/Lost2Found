import React from 'react';

export default function ItemCard({ item }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer">
            {/* Icon / Image */}
            <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-2xl">📦</span>
                )}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 truncate">
                    {item.location} • {item.date}
                </p>
            </div>

            {/* Chevron */}
            <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
