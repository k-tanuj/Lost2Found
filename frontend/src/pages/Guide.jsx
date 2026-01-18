import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, Sparkles, Bell, QrCode, ShieldCheck, Search, CheckCircle,
    ArrowRight, HelpCircle, AlertTriangle, Mail, Hand, MapPin,
    FileText, UserCheck, ChevronDown, ChevronUp
} from 'lucide-react';

// Reusable Accordion Component for detailed steps
const TutorialSection = ({ title, icon: Icon, color, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-6 pt-2 text-slate-600 dark:text-slate-400 relative">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Guide() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-24">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                        <HelpCircle className="w-3 h-3" /> User Manual
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Mastering <span className="text-indigo-600 dark:text-indigo-400">Lost2Found</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A complete step-by-step tutorial on how to report items, use AI search, and safely reclaim your belongings on campus.
                    </p>
                </div>

                {/* Tutorial Sections */}
                <div className="space-y-4">

                    {/* SECTION 1: REPORTING */}
                    <TutorialSection
                        title="1. How to Report an Item"
                        icon={Camera}
                        color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                        defaultOpen={true}
                    >
                        <div className="space-y-8 mt-4">
                            <div className="flex gap-4">
                                <div className="mt-1 font-bold text-indigo-500">A</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Choose Your Path</h4>
                                    <p className="text-sm leading-relaxed mb-3">On the Dashboard or Navbar, select:</p>
                                    <ul className="text-sm space-y-2 list-disc pl-4 marker:text-indigo-500">
                                        <li><strong>"I Lost Something"</strong> if you are missing an item.</li>
                                        <li><strong>"I Found Something"</strong> if you discovered an item.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 font-bold text-indigo-500">B</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Upload a Photo (Crucial!)</h4>
                                    <p className="text-sm leading-relaxed">
                                        Take a clear photo. Our <strong>AI Engine</strong> instantly scans it to detect:
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Colors</span>
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Category</span>
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Labels</span>
                                    </div>
                                    <p className="text-xs italic mt-2 text-slate-400">Tip: Good lighting helps the AI match items 3x faster.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 font-bold text-indigo-500">C</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Details & Location</h4>
                                    <p className="text-sm leading-relaxed">
                                        Enter a Title and Description. Be specific! Mention unique scratches, stickers, or brand names.
                                        Provide the <strong>Location</strong> where it was last seen or found.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TutorialSection>

                    {/* SECTION 2: AI SEARCH */}
                    <TutorialSection
                        title="2. Search & Matches"
                        icon={Search}
                        color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                        <div className="space-y-6 mt-4">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Smart Matching</span>
                                </div>
                                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                    When you report a lost item, we automatically scan all "Found" items. If we find a match &gt; 80% similarity, you get an alert immediately.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Using the Search Page</h4>
                                <p className="text-sm mb-4">Go to the <strong>Search</strong> tab to manually browse items.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <strong className="block mb-1 text-slate-700 dark:text-slate-300">Filters</strong>
                                        Toggle between "All", "Lost", and "Found" to narrow down the list.
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <strong className="block mb-1 text-slate-700 dark:text-slate-300">Keywords</strong>
                                        Type "Blue Wallet" or "Cafeteria". The search checks titles, descriptions, and locations.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TutorialSection>

                    {/* SECTION 3: CLAIMS */}
                    <TutorialSection
                        title="3. Claiming an Item"
                        icon={Hand}
                        color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                        <div className="relative pl-8 space-y-8 mt-2 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                            <div className="relative">
                                <div className="absolute -left-[41px] w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-4 ring-white dark:ring-slate-900">1</div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Click "Claim"</h4>
                                <p className="text-sm">Found your item? Click the <strong>Claim</strong> button on the item card. This opens a secure form.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[41px] w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-4 ring-white dark:ring-slate-900">2</div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Provide Proof</h4>
                                <p className="text-sm">Describe a hidden detail (e.g., "Wallpaper is a dog", "3 keys on ring"). This helps the owner verify it's you.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[41px] w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-4 ring-white dark:ring-slate-900">3</div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Wait for Approval</h4>
                                <p className="text-sm">The owner gets an email & notification. They will review your proof. If approved, you'll receive a clear "Success" email.</p>
                            </div>
                        </div>
                    </TutorialSection>

                    {/* SECTION 4: VERIFICATION */}
                    <TutorialSection
                        title="4. Secure Handover (QR)"
                        icon={QrCode}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        <div className="flex flex-col md:flex-row gap-6 mt-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3">The Digital Passport</h4>
                                <p className="text-sm leading-relaxed mb-4">
                                    Every item has a unique QR code. This is your chain of custody.
                                    <strong> Use this when meeting in person.</strong>
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-xs space-y-2">
                                    <div className="flex gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span>Scanner verifies Item ID instantly</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span>Links to official verification page</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-center text-white flex flex-col items-center justify-center relative overflow-hidden">
                                <QrCode className="w-16 h-16 mb-2 text-white/90" />
                                <span className="font-mono text-xs text-slate-400">SCAN ME</span>
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl"></div>
                            </div>
                        </div>
                    </TutorialSection>

                    {/* SECTION 5: STATUS LEGEND */}
                    <div className="mt-12 bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6" /> Understanding Statuses
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs font-bold uppercase text-emerald-400 mb-1">Found</div>
                                    <span className="text-xs opacity-80">Item is active and available.</span>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs font-bold uppercase text-amber-400 mb-1">Pending</div>
                                    <span className="text-xs opacity-80">Owner is reviewing a claim.</span>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs font-bold uppercase text-indigo-400 mb-1">Returned</div>
                                    <span className="text-xs opacity-80">Successfully handed over.</span>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs font-bold uppercase text-blue-400 mb-1">Secured</div>
                                    <span className="text-xs opacity-80">Held at Campus Security.</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Ready to start?</p>
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
