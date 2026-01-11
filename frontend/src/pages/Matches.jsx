import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function Matches() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);

    // Mock Original Item (In real app, fetch by ID)
    const [originalItem] = useState({
        title: "Lost Black Wallet",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=150&auto=format&fit=crop"
    });

    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            const mockMatches = [
                {
                    id: 1,
                    title: "Found Black Wallet",
                    description: "Found near library entrance. Has a red stitch.",
                    location: "Library",
                    date: "Just Now",
                    imageUrl: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=400&auto=format&fit=crop",
                    matchScore: 94
                },
                {
                    id: 2,
                    title: "Leather Card Holder",
                    description: "Small black card holder found on bench.",
                    location: "Science Block",
                    date: "2 hours ago",
                    imageUrl: "https://images.unsplash.com/photo-1517260739933-28c9d2c2d3ca?q=80&w=400&auto=format&fit=crop",
                    matchScore: 65
                }
            ];
            setMatches(mockMatches);
            setLoading(false);
        }, 1500);
    }, [id]);

    const handleClaim = (matchId) => {
        alert(`Claim request sent for item #${matchId}! The finder has been notified.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-slate-800 pt-8 pb-10 px-6 rounded-b-[30px] shadow-lg text-center relative z-10 mb-6">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="text-white text-lg font-medium">❮ Dashboard</button>
                    <h1 className="text-xl font-bold text-white tracking-wide">AI Matches</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>

                {/* Original Item Preview (Floating) */}
                <div className="absolute -bottom-12 left-0 right-0 px-6">
                    <div className="bg-white rounded-xl shadow-lg p-3 flex items-center space-x-4 mx-auto max-w-sm border border-gray-100">
                        <img src={originalItem.imageUrl} alt="Lost" className="w-12 h-12 rounded-lg object-cover border border-red-100" />
                        <div className="text-left">
                            <p className="text-xs text-red-500 font-bold uppercase tracking-wider">You Lost</p>
                            <p className="text-sm font-bold text-gray-800">{originalItem.title}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 px-4 max-w-md mx-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Scanning network for matches...</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-4 ml-1">
                            We found {matches.length} potential matches
                        </h3>

                        <div className="space-y-6">
                            {matches.map(match => (
                                <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition hover:scale-[1.02]">

                                    {/* Image & Score Overlay */}
                                    <div className="relative h-48">
                                        <img src={match.imageUrl} className="w-full h-full object-cover" alt={match.title} />
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${match.matchScore > 80 ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-900'
                                            }`}>
                                            {match.matchScore}% Match
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-lg font-bold text-gray-900">{match.title}</h2>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{match.date}</span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{match.description}</p>

                                        <div className="flex items-center text-xs text-gray-500 mb-6 space-x-4">
                                            <span className="flex items-center">📍 {match.location}</span>
                                            <span className="flex items-center">👤 Secure Keeper</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-3 items-center justify-center rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200">
                                                Not Mine
                                            </button>
                                            <button
                                                onClick={() => handleClaim(match.id)}
                                                className="py-3 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition"
                                            >
                                                This is Mine!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
