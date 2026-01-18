
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, reportItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { UploadCloud, MapPin, Calendar, Type, Loader2, Sparkles } from 'lucide-react';

export default function Report() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanning, setScanning] = useState(false);

    const [formData, setFormData] = useState({
        type: 'lost',
        title: '',
        description: '',
        locationText: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setScanning(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // AI Effect

            const data = new FormData();
            data.append('type', formData.type);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.title);
            data.append('date', formData.date);
            data.append('userId', currentUser.uid);
            data.append('userEmail', currentUser.email);

            if (file) {
                data.append('image', file);
            }

            if (formData.locationText) {
                data.append('location', formData.locationText);
            }

            const result = await reportItem(data);

            setScanning(false);
            navigate(`/matches/${result.item.id}`);
        } catch (error) {
            console.error("Error reporting item:", error);
            const errMsg = error.response?.data?.error || error.message;
            alert(`FAILED: ${errMsg}`);
            setScanning(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 font-sans text-slate-800">
            <Navbar />

            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report an Item</h1>
                    <p className="text-slate-500 mt-2 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" /> Let our AI help you resolve this.
                    </p>
                </div>

                <div className="glass rounded-3xl shadow-2xl p-8 animate-fade-in animate-delay-100 border border-white/50 bg-white/80 backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Type Toggle */}
                        <div className="flex p-1 bg-slate-100 rounded-xl relative">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'lost' })}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${formData.type === 'lost' ? 'bg-white text-red-500 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                I Lost Something
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'found' })}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${formData.type === 'found' ? 'bg-white text-emerald-600 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                I Found Something
                            </button>
                        </div>

                        {/* Image Upload - Modern Drag & Drop Style */}
                        <div className="relative group">
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors bg-white/50 hover:bg-white/80 cursor-pointer overflow-hidden h-64 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                            <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/30 flex items-center gap-2">
                                                <UploadCloud className="w-5 h-5" /> Change Photo
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-600 font-semibold">Upload an image</p>
                                        <p className="text-xs text-slate-400 mt-1">Our AI will handle the tagging.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="What is it? (e.g. Blue Wallet)"
                                    onChange={handleChange}
                                    className="w-full pl-11 p-4 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium"
                                />
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="locationText"
                                    required
                                    placeholder="Where? (e.g. Library)"
                                    onChange={handleChange}
                                    className="w-full pl-11 p-4 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium"
                                />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <textarea
                            name="description"
                            rows="3"
                            required
                            placeholder="Any specific details? (Scratches, brands, stickers...)"
                            onChange={handleChange}
                            className="w-full p-4 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400 resize-none font-medium"
                        />

                        <div className="relative">
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full pl-11 p-4 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-600"
                            />
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transform transition-all active:scale-95 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'}`}
                        >
                            {scanning ? (
                                <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing with Gemini AI...</>
                            ) : (
                                loading ? 'Submitting...' : 'Submit Report'
                            )}
                        </button>

                    </form>
                </div>
            </div>

            {/* AI Scanning Overlay */}
            {scanning && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-fade-in mx-4">
                        <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Image</h3>
                        <p className="text-slate-500 text-sm">Gemini AI is extracting features to find the best match.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
