import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2 } from 'lucide-react';
import { markNotificationRead } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, writeBatch, doc } from 'firebase/firestore';

export default function NotificationBell() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
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
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleClearAll = async () => {
        if (notifications.length === 0) return;

        try {
            const batch = writeBatch(db);
            notifications.forEach(notif => {
                const notifRef = doc(db, "notifications", notif.id);
                batch.delete(notifRef);
            });
            await batch.commit();
            // Local state updaes automatically via onSnapshot, but we can reset proactively
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to clear notifications", error);
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
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Clear All
                            </button>
                        )}
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
                                    onClick={() => {
                                        if (!notif.read && notif.status !== 'ACTION_REQUIRED') {
                                            handleMarkRead(notif.id);
                                        }
                                        // Navigate based on notification type
                                        if (notif.itemId) {
                                            if (
                                                notif.type === 'potential_match' ||
                                                notif.type === 'CLAIM_REQUEST' ||
                                                notif.type === 'MATCH_FOUND'
                                            ) {
                                                // Go to specific item detail for these types
                                                setIsOpen(false);
                                                navigate(`/item/${notif.itemId}`);
                                            } else {
                                                // Default fallback
                                                setIsOpen(false);
                                                navigate('/my-reports');
                                            }
                                        }
                                    }}
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
                                                    navigate(`/item/${notif.itemId}`);
                                                }}
                                                className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                            >
                                                Review
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
