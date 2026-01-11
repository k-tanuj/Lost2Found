import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import Theme Hook
import BottomNav from '../components/BottomNav';

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme(); // Use Theme Hook

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
            <div className="bg-slate-800 pt-8 pb-6 px-6 rounded-b-[30px] shadow-lg text-center relative z-10 mb-6">
                <button onClick={() => navigate(-1)} className="absolute left-6 top-8 text-white text-lg">❮ Back</button>
                <h1 className="text-xl font-bold text-white tracking-wide">My Profile</h1>
            </div>

            <div className="px-6">
                {/* User Info Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center mb-6 transition-colors duration-300">
                    <img
                        src={currentUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-50 dark:border-slate-700"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentUser?.displayName || "Guest User"}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{currentUser?.email || "guest@example.com"}</p>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 dark:bg-slate-700 p-2 rounded-full text-blue-600 dark:text-blue-400">
                                {theme === 'dark' ? '🌙' : '☀️'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white">Dark Mode</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Adjust screen brightness</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                >
                    Logout
                </button>
            </div>
            <BottomNav />
        </div>
    );
}
