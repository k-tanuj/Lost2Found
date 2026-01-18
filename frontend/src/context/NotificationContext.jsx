
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message, duration = 5000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            removeNotification(id);
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const success = (msg) => addNotification('success', msg);
    const error = (msg) => addNotification('error', msg);
    const info = (msg) => addNotification('info', msg);

    return (
        <NotificationContext.Provider value={{ success, error, info }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`
                            flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-[300px] animate-slide-in
                            ${notif.type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : ''}
                            ${notif.type === 'error' ? 'bg-white border-red-500 text-slate-800' : ''}
                            ${notif.type === 'info' ? 'bg-white border-blue-500 text-slate-800' : ''}
                        `}
                    >
                        <div className="mr-3">
                            {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {notif.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                        </div>
                        <p className="font-medium text-sm flex-1">{notif.message}</p>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="ml-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
