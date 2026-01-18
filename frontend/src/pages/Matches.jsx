
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatches, getItemById, createNotification, claimItem } from '../services/api';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Info, X, CheckCircle, ExternalLink, Shield, AlertCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Matches() {
    const { id } = useParams();
    const navigate = useNavigate();
    const notification = useNotification();
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [originalItem, setOriginalItem] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (id) {
                try {
                    const data = await getItemById(id);
                    setOriginalItem(data);
                } catch (error) {
                    console.error("Error fetching item", error);
                }
            }
        };
        fetchItemDetails();
    }, [id]);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const data = await getMatches(id);
                setMatches(data);
            } catch (err) {
                console.error("Failed to load matches", err);
                notification.error("Failed to load matches. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMatches();
    }, [id]);

    // Helper to handle Drive Images
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com/thumbnail')) return url;
        if (url.includes('drive.google.com/uc')) {
            const idMatch = url.match(/id=([^&]+)/);
            if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
        }
        if (url.includes('drive.google.com/file/d/')) {
            const idMatch = url.match(/\/d\/([^\/]+)/);
            if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
        }
        return url;
    };

    const handleClaim = async (matchId) => {
        try {
            await claimItem(matchId);
            notification.success(`Claim request sent! The owner has been notified.`);
        } catch (error) {
            console.error("Claim failed", error);
            const errorMsg = error.response?.data?.error || "Failed to send claim request.";
            notification.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header & Original Item Preview */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Match Results</h1>
                        <p className="text-slate-500 mt-2 flex items-center">
                            {matches.length > 0
                                ? <><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Found {matches.length} potential matches.</>
                                : "Scanning our intelligent network..."}
                        </p>
                    </div>

                    {originalItem && (
                        <div className="mt-6 md:mt-0 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <div className="mr-4 text-right">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Your Lost Item</p>
                                <p className="font-bold text-slate-800">{originalItem.title}</p>
                            </div>
                            <img src={getEmbedUrl(originalItem.imageUrl)} alt="Original" className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100" />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-32">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-slate-500 font-medium">Analyzing visual features and metadata...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {matches.map((match, index) => (
                            <div
                                key={match.id}
                                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Area */}
                                <div className="relative h-64 overflow-hidden bg-slate-100">
                                    <img
                                        src={getEmbedUrl(match.imageUrl)}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        alt={match.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80"></div>

                                    {/* Score Badge */}
                                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1 ${match.matchScore > 80 ? 'bg-emerald-500/90 text-white' : 'bg-amber-400/90 text-slate-900'
                                        }`}>
                                        <Shield className="w-3 h-3" />
                                        {match.matchScore}% Match
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{match.category || 'Item'}</p>
                                        <h3 className="text-xl font-bold text-white">{match.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* AI Reason */}
                                    {match.matchReason && (
                                        <div className="mb-5 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2 text-indigo-700">
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <Info className="w-3 h-3" />
                                                </div>
                                                <p className="text-xs font-bold uppercase">AI Insight</p>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{match.matchReason}</p>
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span>{match.location || match.locationText}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <Calendar className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span>{new Date(match.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <p className="text-slate-500 line-clamp-2 mt-2 pl-7 text-xs italic">{match.description}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button
                                            onClick={() => setSelectedMatch(match)}
                                            className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Info className="w-4 h-4" /> Details
                                        </button>
                                        <button
                                            onClick={() => handleClaim(match.id)}
                                            disabled={match.status && match.status !== 'lost' && match.status !== 'found'}
                                            className={`py-2.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2
                                                ${(match.status && match.status !== 'lost' && match.status !== 'found')
                                                    ? 'bg-slate-300 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
                                                }`}
                                        >
                                            {(match.status && match.status !== 'lost' && match.status !== 'found')
                                                ? (match.status === 'CLAIMED' ? 'Pending' : 'Resolved')
                                                : 'Claim'}
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && matches.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🤷‍♂️</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">Don't worry, we're continuously scanning. We'll notify you when we find something similar.</p>
                        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center justify-center gap-2 mx-auto">
                            Return to Dashboard <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* DETAILS MODAL */}
            {selectedMatch && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedMatch(null)}
                    ></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-scale-in">

                        <div className="relative h-64 bg-slate-100">
                            <img
                                src={getEmbedUrl(selectedMatch.imageUrl)}
                                alt={selectedMatch.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedMatch(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-1">{selectedMatch.category}</p>
                                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">{selectedMatch.title}</h2>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold ${selectedMatch.matchScore > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {selectedMatch.matchScore}% Match
                                </div>
                            </div>

                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                {selectedMatch.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Found At</p>
                                    <div className="flex items-center text-slate-800 font-medium">
                                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                                        {selectedMatch.location || selectedMatch.locationText}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">ID</div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reported By</p>
                                <p className="text-xs font-mono text-slate-600 select-all">{selectedMatch.userId || 'Anonymous'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Date</p>
                            <div className="flex items-center text-slate-800 font-medium">
                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                {new Date(selectedMatch.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (!selectedMatch.status || selectedMatch.status === 'lost' || selectedMatch.status === 'found') {
                                handleClaim(selectedMatch.id);
                                setSelectedMatch(null);
                            }
                        }}
                        disabled={selectedMatch.status && selectedMatch.status !== 'lost' && selectedMatch.status !== 'found'}
                        className={`w-full py-4 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2
                                    ${(selectedMatch.status && selectedMatch.status !== 'lost' && selectedMatch.status !== 'found')
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-95'
                            }`}
                    >
                        {(selectedMatch.status && selectedMatch.status !== 'lost' && selectedMatch.status !== 'found')
                            ? <><AlertCircle className="w-5 h-5" /> Item {selectedMatch.status === 'CLAIMED' ? 'Pending Approval' : 'Already Resolved'}</>
                            : <><CheckCircle className="w-5 h-5" /> Claim This Item</>}
                    </button>
                </div>
            )
            }
        </div >
    );
}
