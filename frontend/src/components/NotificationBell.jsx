import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { markNotificationRead } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function NotificationBell() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!currentUser) return;

        // "Professional Standard": Real-time listener
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
            // Note: server-side sorting requires an index.
            // We sort client-side to ensure it works instantly for you.
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side sort by date (newest first)
            notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        }, (error) => {
            console.error("Real-time notification error:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            // Notes: onSnapshot will automatically update the UI when the backend writes to Firestore!
            // But for immediate feedback, we can also update local state if needed.
            // With Flux/Real-time, we usually just wait for the server event,
            // but optimistic updates feel snappier.
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-800 transition-colors group"
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-indigo-400' : 'text-slate-300'} group-hover:text-white transition-colors`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-[100] animate-scale-in origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer 
                                            ${!notif.read && notif.priority === 'HIGH' ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' :
                                            !notif.read ? 'bg-indigo-50/20' : ''}`}
                                    onClick={() => !notif.read && notif.status !== 'ACTION_REQUIRED' && handleMarkRead(notif.id)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-semibold ${!notif.read ? 'text-indigo-900' : 'text-slate-700'}`}>{notif.title}</h4>
                                            {notif.priority === 'HIGH' && (
                                                <span className="text-[8px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tighter animate-pulse">Action</span>
                                            )}
                                        </div>
                                        {!notif.read && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{notif.message}</p>

                                    {/* Actionable Buttons for CLAIM_REQUEST */}
                                    {notif.type === 'CLAIM_REQUEST' && !notif.read && (
                                        <div className="flex gap-2 mb-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={async () => {
                                                    await handleMarkRead(notif.id);
                                                    setIsOpen(false);
                                                    window.location.href = '/activity';
                                                }}
                                                className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                            >
                                                Review & Approve
                                            </button>
                                            <button
                                                onClick={() => handleMarkRead(notif.id)}
                                                className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Later
                                            </button>
                                        </div>
                                    )}

                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
