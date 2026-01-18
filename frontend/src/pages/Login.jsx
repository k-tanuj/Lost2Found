import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
    Radar, Scan, Zap, ShieldCheck, QrCode, ArrowRight,
    Laptop, GraduationCap, Clock, BookOpen, Search,
    Camera, CheckCircle2, Globe, Sparkles, Smartphone,
    Key, Briefcase, IdCard, Bike, HandHeart, ClipboardList,
    UserCheck, BellRing, Cloud, Wind, Moon
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// --- Sub-components (outside to avoid recreation on re-render) ---

const FloatingIcon = ({ icon: Icon, delay, top, left, size = 24 }) => (
    <motion.div
        animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.25, 0.1]
        }}
        transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
        className="absolute pointer-events-none z-10"
        style={{ top: `${top}%`, left: `${left}%` }}
    >
        <Icon size={size} className="text-indigo-400/40" strokeWidth={1} />
    </motion.div>
);

const CampusBuilding = ({ type, x, y, delay, scale = 1, opacity = 0.3 }) => (
    <motion.div
        style={{ left: `${x}%`, bottom: `${y}%`, scale }}
        className="absolute pointer-events-none z-0 overflow-visible"
    >
        <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            {type === 'clock-tower' && (
                <g opacity={opacity}>
                    <path d="M70 300V60H130V300" fill="currentColor" className="text-slate-900" />
                    <path d="M60 60L100 0L140 60H60Z" fill="currentColor" className="text-slate-800" />
                    <circle cx="100" cy="50" r="10" fill="currentColor" className="text-indigo-500/50" />
                    <motion.circle
                        cx="100" cy="50" r="3" fill="white"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {[70, 110, 150, 190, 230].map(wy => (
                        <rect key={wy} x="85" y={wy} width="10" height="15" rx="2" fill="currentColor" className="text-indigo-400/10" />
                    ))}
                </g>
            )}
            {type === 'library' && (
                <g opacity={opacity}>
                    <path d="M20 300V100H180V300" fill="currentColor" className="text-slate-900" />
                    <path d="M10 100H190L100 40L10 100Z" fill="currentColor" className="text-slate-800" />
                    {[40, 80, 120, 160].map(cx => (
                        <rect key={cx} x={cx - 2} y="110" width="4" height="180" fill="currentColor" className="text-slate-800" />
                    ))}
                </g>
            )}
            {type === 'tree' && (
                <motion.g
                    opacity={opacity}
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 6, repeat: Infinity, delay }}
                >
                    <path d="M95 300V240" stroke="currentColor" strokeWidth="6" className="text-slate-900" />
                    <path d="M100 240C140 240 160 200 160 160C160 120 130 80 100 80C70 80 40 120 40 160C40 200 60 240 100 240Z" fill="currentColor" className="text-indigo-900/20" />
                    <path d="M100 220C130 220 145 190 145 160C145 130 125 100 100 100C75 100 55 130 55 160C55 190 70 220 100 220Z" fill="currentColor" className="text-indigo-500/10" />
                </motion.g>
            )}
        </svg>
    </motion.div>
);

const Step = ({ icon: Icon, title, desc, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative flex flex-col items-center text-center group"
        >
            <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-indigo-500/5">
                <Icon className="w-10 h-10 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-3">{title}</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">{desc}</p>
            {index < 3 && (
                <div className="hidden lg:block absolute top-10 -right-1/2 w-full h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent" />
            )}
        </motion.div>
    );
};

// --- Main Component ---

export default function Login() {
    const { login, loginAsGuest, currentUser } = useAuth();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();

    // Smooth scroll progress for parallax
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Parallax Transforms (Hooks called at top level)
    const heroY = useTransform(smoothProgress, [0, 0.2], [0, -120]);
    const opacityHero = useTransform(smoothProgress, [0, 0.15], [1, 0]);

    // Background Parallax
    const cloudX = useTransform(smoothProgress, [0, 1], [0, 400]);
    const cloud2X = useTransform(smoothProgress, [0, 1], [0, -300]);
    const buildingsY = useTransform(smoothProgress, [0, 1], [0, -150]);
    const farBuildingsY = useTransform(smoothProgress, [0, 1], [0, -80]);

    useEffect(() => {
        if (currentUser) navigate('/dashboard');
    }, [currentUser, navigate]);

    const handleLogin = async () => {
        try {
            await login();
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 overflow-x-hidden scroll-smooth">

            {/* Immersive Background Container */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Master Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(99,102,241,0.05),transparent_50%)]" />

                {/* Dynamic Environmental Particles */}
                <motion.div style={{ x: cloudX }} className="absolute top-20 left-10 opacity-10">
                    <Cloud size={120} strokeWidth={0.5} className="text-indigo-300" />
                </motion.div>
                <motion.div style={{ x: cloud2X }} className="absolute top-60 right-20 opacity-5">
                    <Cloud size={180} strokeWidth={0.5} className="text-indigo-400" />
                </motion.div>

                {/* Far Background Buildings */}
                <motion.div style={{ y: farBuildingsY }} className="absolute bottom-0 w-full h-1/2">
                    <CampusBuilding type="library" x={5} y={-5} scale={0.8} opacity={0.15} />
                    <CampusBuilding type="clock-tower" x={80} y={-10} scale={0.7} opacity={0.1} />
                    <CampusBuilding type="tree" x={25} y={-2} scale={0.6} opacity={0.1} delay={0.5} />
                </motion.div>

                {/* Mid Background Buildings */}
                <motion.div style={{ y: buildingsY }} className="absolute bottom-0 w-full h-1/2">
                    <CampusBuilding type="clock-tower" x={15} y={-15} scale={1.2} opacity={0.25} />
                    <CampusBuilding type="library" x={60} y={-20} scale={1.1} opacity={0.2} />
                    <CampusBuilding type="tree" x={45} y={-5} scale={1.5} opacity={0.15} delay={0} />
                    <CampusBuilding type="tree" x={85} y={-5} scale={1.3} opacity={0.15} delay={1.2} />
                </motion.div>

                {/* Floating Props */}
                <FloatingIcon icon={IdCard} delay={0} top={15} left={10} size={48} />
                <FloatingIcon icon={Key} delay={1.5} top={25} left={85} size={40} />
                <FloatingIcon icon={Smartphone} delay={0.5} top={70} left={15} size={44} />
                <FloatingIcon icon={Briefcase} delay={2} top={80} left={75} size={56} />
                <FloatingIcon icon={Bike} delay={2.5} top={60} left={90} size={50} />
            </div>

            {/* 1. Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden z-10">
                <motion.div
                    style={{ y: heroY, opacity: opacityHero }}
                    className="relative text-center space-y-10 max-w-6xl"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.3em]"
                    >
                        <Sparkles className="w-4 h-4 fill-current" />
                        Campus Lost & Found Network
                    </motion.div>

                    <h1 className="text-8xl md:text-[140px] font-black tracking-tighter leading-[0.9] text-white">
                        <motion.span
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="inline-block"
                        >
                            Lose nothing.
                        </motion.span> <br />
                        <motion.span
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="inline-block pb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400"
                        >
                            Find everything.
                        </motion.span>
                    </h1>

                    <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        Reuniting students with their belonging using AI-driven visual matching. Safe, fast, and exclusive to your campus.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <button
                            onClick={handleLogin}
                            className="px-12 py-6 bg-white text-slate-950 font-black rounded-3xl hover:bg-indigo-50 transition-all flex items-center gap-3 group shadow-2xl shadow-indigo-500/20 active:scale-95"
                        >
                            Get Started
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleGuestLogin}
                            className="px-12 py-6 bg-slate-900/50 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
                        >
                            Explore Demo
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute bottom-12 flex flex-col items-center gap-3 text-slate-500 opacity-40 hover:opacity-100 transition-opacity"
                >
                    <span className="text-[10px] uppercase font-black tracking-widest">Scroll to Explore</span>
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-transparent rounded-full" />
                </motion.div>
            </section>

            {/* 2. How It Works */}
            <section className="py-40 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-5xl font-black text-white">How it Works</h2>
                        <p className="text-slate-400 font-medium">Four simple steps to recover your essentials.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative">
                        <Step index={0} icon={ClipboardList} title="Report" desc="Instantly upload a photo of what you lost or found." />
                        <Step index={1} icon={Radar} title="Match" desc="Our AI scans the campus network for visual similarities." />
                        <Step index={2} icon={QrCode} title="Claim" desc="Verify ownership via encrypted handover passports." />
                        <Step index={3} icon={HandHeart} title="Return" desc="Meet at a safe hotspot and complete the reunion." />
                    </div>
                </div>
            </section>

            {/* 3. Trust & Safety Section */}
            <section className="py-40 px-6 relative overflow-hidden z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-6xl font-black text-white leading-tight">Built for Campus Trust.</h2>
                            <p className="text-xl text-slate-400 leading-relaxed font-medium">We've combined AI precision with community security protocol to create a safe recovery environment.</p>
                        </div>

                        <div className="grid gap-8">
                            <div className="flex items-start gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                                    <UserCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white mb-2">Verified Campus Users</h4>
                                    <p className="text-slate-400 text-sm font-medium">Access is limited to students and faculty with valid credentials.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                                    <BellRing className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white mb-2">Real-Time Notifications</h4>
                                    <p className="text-slate-400 text-sm font-medium">Get alerted the moment a potential match is reported nearby.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full" />
                        <div className="relative p-12 aspect-square rounded-[64px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center justify-center overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-20 border-2 border-dashed border-indigo-500/20 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-40 h-40 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-3xl shadow-indigo-600/40 relative z-10"
                            >
                                <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain scale-[1.8]" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Final CTA */}
            <section className="py-40 px-6 flex items-center justify-center z-10">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    className="w-full max-w-2xl relative"
                >
                    <div className="p-16 md:p-24 rounded-[80px] bg-white/[0.04] backdrop-blur-3xl border border-white/10 relative overflow-hidden group">
                        <div className="space-y-8 mb-16 relative z-10 text-center md:text-left">
                            <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">Ready to reconnect?</h2>
                            <p className="text-slate-400 text-lg font-medium">Join the campus-exclusive network today.</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                animate={{ boxShadow: ["0 0 0px rgba(79,70,229,0)", "0 0 30px rgba(79,70,229,0.3)", "0 0 0px rgba(79,70,229,0)"] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                onClick={handleLogin}
                                className="group w-full flex items-center justify-between px-10 py-7 bg-white text-slate-900 font-black rounded-[32px] transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-5 text-xl">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google Login
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                            </motion.button>

                            <button
                                onClick={handleGuestLogin}
                                className="w-full py-7 bg-white/5 border border-white/10 rounded-[32px] font-black text-lg hover:bg-white/10 transition-all active:scale-95 text-slate-400 hover:text-white"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-12 z-10 relative">
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white p-3 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-[1.8]" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter">Lost2Found</span>
                    </div>
                    <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed">
                        The ultimate recovery network designed for the modern campus ecosystem.
                    </p>
                    <p className="text-slate-600 text-xs font-black uppercase tracking-[0.4em] leading-snug">
                        © 2026 Campus Recovery Network <br /> Building Trust on Campus.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-16 md:gap-32">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Features</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Matching</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Lifecycle Tracking</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Safe Handover</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Company</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Safety Guide</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
