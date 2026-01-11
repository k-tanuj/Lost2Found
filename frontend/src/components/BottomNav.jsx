import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', icon: '🏠', path: '/dashboard' },
        { name: 'Search', icon: '🔍', path: '/search' }, // Placeholder path
        { name: 'My Reports', icon: '📝', path: '/my-reports' }, // Placeholder path
        { name: 'Profile', icon: '👤', path: '/profile' }, // Placeholder path
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white border-t border-slate-700 pb-safe">
            <div className="flex justify-around items-center h-16 max-w-5xl mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-medium">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
