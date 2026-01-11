import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, reportItem } from '../services/api'; // Ensure these are exported from api.js
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav'; // Assuming you want navigation here too

export default function Report() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanning, setScanning] = useState(false); // Fake AI scan effect

    const [formData, setFormData] = useState({
        type: 'lost',
        title: '',
        description: '',
        location: '',
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
        if (!file) return alert("Please upload an image!");

        setLoading(true);
        setScanning(true); // Start "AI Scan"

        try {
            // Fake delay for "AI Scanning" text
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 1. Upload Image
            const imageUrl = await uploadImage(file);

            // 2. Report Item
            await reportItem({
                ...formData,
                imageUrl,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                status: 'open'
            });

            setScanning(false);
            // alert("Item reported successfully!");
            // DEMO: Go straight to the Matches page to show off the "Match Found" screen
            navigate('/matches/123');
        } catch (error) {
            console.error("Error reporting item:", error);
            alert("Failed to report item.");
            setScanning(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* App Header */}
            <div className="bg-slate-800 pt-8 pb-6 px-6 rounded-b-[30px] shadow-lg text-center relative z-10 mb-6">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-white text-lg">
                        ❮ Back
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-wide">Report Item</h1>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-md mx-auto px-4">

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Type Toggle */}
                    <div className="bg-white p-2 rounded-xl shadow-sm flex">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'lost' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.type === 'lost' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            I Lost Something
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'found' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.type === 'found' ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            I Found Something
                        </button>
                    </div>

                    {/* Image Upload Area */}
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center border-2 border-dashed border-gray-200 hover:border-blue-400 transition cursor-pointer relative overflow-hidden group">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {previewUrl ? (
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <span className="text-white font-bold">Change Photo</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    📷
                                </div>
                                <p className="text-gray-600 font-medium">Tap to Upload Photo</p>
                                <p className="text-xs text-gray-400 mt-1">AI will auto-generate tags</p>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Item Details</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="What is it? (e.g. Wallet)"
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="Where was it? (e.g. Library)"
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <textarea
                                name="description"
                                rows="3"
                                required
                                placeholder="Description (color, brand, marks)..."
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-400 resize-none"
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition active:scale-95 ${loading ? 'bg-gray-400' : 'bg-slate-800 hover:bg-slate-900'
                            }`}
                    >
                        {scanning ? '🤖 Analyzing Item...' : (loading ? 'Submitting...' : 'Submit Report')}
                    </button>

                </form>
            </div>

            {/* Scanning Overlay Effect */}
            {scanning && (
                <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Image...</h3>
                        <p className="text-gray-500 text-sm">Extracting features using Google Vision AI to find matches.</p>
                    </div>
                </div>
            )}

            {/* <BottomNav /> */}
        </div>
    );
}
