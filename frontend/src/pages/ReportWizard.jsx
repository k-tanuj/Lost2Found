import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, Calendar, MapPin, Type, CheckCircle } from 'lucide-react';

export default function ReportWizard() {
    const { type } = useParams(); // 'lost' or 'found'
    const { currentUser } = useAuth();
    const notification = useNotification();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        locationText: '',
        date: new Date().toISOString().split('T')[0]
    });

    const totalSteps = type === 'found' ? 3 : 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const data = new FormData();
            data.append('type', type);
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
                data.append('locationText', formData.locationText);
            }

            const result = await reportItem(data);

            // Show completion screen
            setStep(totalSteps + 1);
        } catch (error) {
            console.error("Error reporting item:", error);
            const errMsg = error.response?.data?.error || error.message;
            notification.error(`Failed to report: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Progress Indicator */}
                {step <= totalSteps && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                Step {step} of {totalSteps}
                            </span>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                {Math.round((step / totalSteps) * 100)}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / totalSteps) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}

                {/* Wizard Steps */}
                <AnimatePresence mode="wait" custom={step}>
                    <motion.div
                        key={step}
                        custom={step}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12"
                    >
                        {/* Step 1: What */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                                    <Type className="w-6 h-6" />
                                    <h2 className="text-2xl font-black">
                                        What did you {type === 'lost' ? 'lose' : 'find'}?
                                    </h2>
                                </div>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Blue wallet"
                                    autoFocus
                                    className="w-full text-3xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                                />
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.title.trim()}
                                    className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    Next <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Where */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                                    <MapPin className="w-6 h-6" />
                                    <h2 className="text-2xl font-black">
                                        Where did you {type === 'lost' ? 'last see it' : 'find it'}?
                                    </h2>
                                </div>
                                <input
                                    type="text"
                                    value={formData.locationText}
                                    onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
                                    placeholder="e.g., Library, 2nd floor"
                                    autoFocus
                                    className="w-full text-3xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700"
                                />
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.locationText.trim()}
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Next <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: When (Lost only) */}
                        {step === 3 && type === 'lost' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                                    <Calendar className="w-6 h-6" />
                                    <h2 className="text-2xl font-black">When did you lose it?</h2>
                                </div>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full text-2xl font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white"
                                />
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Next <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3/4: Photo */}
                        {((step === 3 && type === 'found') || (step === 4 && type === 'lost')) && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                                    <Upload className="w-6 h-6" />
                                    <h2 className="text-2xl font-black">
                                        Do you have a photo? <span className="text-slate-400 text-lg">(optional)</span>
                                    </h2>
                                </div>

                                <div className="relative group">
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800/50 cursor-pointer h-64 flex flex-col items-center justify-center">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm rounded-2xl">
                                                    <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/30 flex items-center gap-2">
                                                        <Upload className="w-5 h-5" /> Change Photo
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 font-semibold">Upload an image</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Helps others identify your item</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!file) {
                                                // Skip photo
                                                handleSubmit();
                                            } else {
                                                handleSubmit();
                                            }
                                        }}
                                        disabled={loading}
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Submitting...' : (file ? 'Submit' : 'Skip & Submit')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Completion Screen */}
                        {step === totalSteps + 1 && (
                            <div className="text-center space-y-6 py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                    {type === 'lost' ? "Thanks. We're looking for your item." : "Thanks for helping."}
                                </h2>

                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                                    {type === 'lost'
                                        ? "You don't need to do anything right now. We'll notify you if we find a possible match."
                                        : "If someone claims this item, we'll notify you."}
                                </p>

                                <button
                                    onClick={() => navigate('/my-reports')}
                                    className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
                                >
                                    View my reports
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
