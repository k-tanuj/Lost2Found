import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { getItems } from '../services/api';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // all, lost, found

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                // Fetch 'all' items to allow client-side filtering
                const data = await getItems('all');
                setItems(data);
                setFilteredItems(data);
            } catch (error) {
                console.error("Failed to fetch search items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllItems();
    }, []);

    useEffect(() => {
        let result = items;

        // 1. Text Filter
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(item =>
                item.title?.toLowerCase().includes(lowerQuery) ||
                item.description?.toLowerCase().includes(lowerQuery) ||
                item.category?.toLowerCase().includes(lowerQuery) ||
                item.location?.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Type Filter
        if (activeFilter !== 'all') {
            result = result.filter(item => item.type === activeFilter);
        }

        setFilteredItems(result);
    }, [query, activeFilter, items]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Explore Items</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Find lost objects or browse found reports.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, location, or tag..."
                            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm group-focus-within:shadow-lg dark:text-white"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter className="w-4 h-4 text-slate-400 mr-2" />
                    {['all', 'lost', 'found'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all border
                                ${activeFilter === filter
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            {filter}
                        </button>
                    ))}
                    <div className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                        {filteredItems.length} Result{filteredItems.length !== 1 && 's'}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[50vh]">
                        {filteredItems.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ItemCard
                                                item={item}
                                                onClick={() => navigate(`/item/${item.id}`)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                    <SearchIcon className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching items found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => { setQuery(''); setActiveFilter('all'); }}
                                    className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
