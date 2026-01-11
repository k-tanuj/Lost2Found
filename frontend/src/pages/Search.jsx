import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Search() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-slate-800 pt-8 pb-6 px-6 rounded-b-[30px] shadow-lg text-center relative z-10 mb-6">
                <button onClick={() => navigate(-1)} className="absolute left-6 top-8 text-white text-lg">❮ Back</button>
                <h1 className="text-xl font-bold text-white tracking-wide">Search Items</h1>
            </div>

            <div className="px-4">
                <input
                    type="text"
                    placeholder="Search for keys, wallet..."
                    className="w-full p-4 rounded-xl shadow-lg border-none outline-none text-lg"
                />
                <div className="mt-8 text-center text-gray-400">
                    <p>Start typing to search...</p>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
