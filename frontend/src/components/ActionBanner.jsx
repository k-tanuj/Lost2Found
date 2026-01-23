import { AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionBanner({ count }) {
    const navigate = useNavigate();

    if (!count || count === 0) return null;

    return (
        <div className="bg-indigo-600 border-b border-indigo-500 animate-slide-down">
            <div className="max-w-7xl mx-auto py-2.5 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center">
                        <span className="flex p-1.5 rounded-lg bg-indigo-700">
                            <AlertCircle className="h-4 w-4 text-white animate-pulse" aria-hidden="true" />
                        </span>
                        <p className="ml-3 font-bold text-white text-sm truncate">
                            <span className="md:hidden">Someone needs your help!</span>
                            <span className="hidden md:inline">Someone says an item is theirs. Please review.</span>
                        </p>
                    </div>
                    <div className="order-3 mt-0 flex-shrink-0 w-auto">
                        <button
                            onClick={() => navigate('/activity')}
                            className="flex items-center justify-center px-4 py-1.5 border border-transparent rounded-full shadow-sm text-xs font-bold text-indigo-600 bg-white hover:bg-indigo-50 transition-all group"
                        >
                            Check it out
                            <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
