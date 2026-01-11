import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function MyReports() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-slate-800 pt-8 pb-6 px-6 rounded-b-[30px] shadow-lg text-center relative z-10 mb-6">
                <button onClick={() => navigate(-1)} className="absolute left-6 top-8 text-white text-lg">❮ Back</button>
                <h1 className="text-xl font-bold text-white tracking-wide">My Reports</h1>
            </div>

            <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-700">No Reports Yet</h2>
                <p className="text-gray-500 mt-2">You haven't reported any lost or found items.</p>
                <button
                    onClick={() => navigate('/report')}
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 font-bold"
                >
                    Report an Item
                </button>
            </div>
            <BottomNav />
        </div>
    );
}
