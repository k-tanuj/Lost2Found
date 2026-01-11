import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import BottomNav from '../components/BottomNav';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Mock data matching the design style
        const mockItems = [
            {
                id: 1,
                title: "Wallet",
                description: "Found at Library",
                location: "Library",
                date: "10 mins ago",
                type: "found",
                imageUrl: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=100&auto=format&fit=crop"
            },
            {
                id: 2,
                title: "Keys",
                description: "Found Near Cafeteria",
                location: "Cafeteria",
                date: "25 mins ago",
                type: "found",
                imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=100&auto=format&fit=crop"
            },
            {
                id: 3,
                title: "Water Bottle",
                description: "Found at Gym",
                location: "Gym",
                date: "30 mins ago",
                type: "found",
                imageUrl: "https://images.unsplash.com/photo-1602143407151-1111d30e8748?q=80&w=100&auto=format&fit=crop"
            }
        ];
        setItems(mockItems);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 font-sans transition-colors duration-300">
            {/* App-like Header */}
            <div className="bg-slate-800 pt-12 pb-6 px-6 rounded-b-[30px] shadow-lg text-center relative z-10">
                <h1 className="text-2xl font-extrabold text-white tracking-wide">Lost2Found</h1>
                <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Google Powered</p>

                {/* Settings/Chat Icons Placeholder */}
                <div className="absolute top-12 right-6 flex space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm">⚙️</div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-6 relative z-20">
                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 flex items-center mb-6 transition-colors duration-300">
                    <span className="pl-3 text-gray-400 text-lg">🔍</span>
                    <input
                        type="text"
                        placeholder="Search lost item..."
                        className="flex-1 p-2 outline-none text-gray-700 dark:text-white bg-transparent dark:placeholder-gray-500"
                    />
                    <span className="pr-3 text-gray-400">🎤</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => navigate('/report')}
                        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center space-y-2 transition transform hover:scale-[1.02]"
                    >
                        <span className="text-3xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">😟</span>
                        <span className="font-bold text-sm">I Lost Something</span>
                    </button>
                    <button
                        onClick={() => navigate('/report')}
                        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow-md flex flex-col items-center space-y-2 transition transform hover:scale-[1.02]"
                    >
                        <span className="text-3xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">😃</span>
                        <span className="font-bold text-sm">I Found Something</span>
                    </button>
                </div>

                {/* Recently Reported List */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 px-1">Recently Reported Items</h3>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
