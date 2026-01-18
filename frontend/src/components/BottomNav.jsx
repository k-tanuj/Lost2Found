
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, FileText, User } from 'lucide-react';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', Icon: Home, path: '/dashboard' },
        { name: 'Search', Icon: Search, path: '/search' },
        { name: 'My Reports', Icon: FileText, path: '/my-reports' },
        { name: 'Profile', Icon: User, path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 pb-safe z-50">
            <div className="flex justify-around items-center h-16 max-w-5xl mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <item.Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
