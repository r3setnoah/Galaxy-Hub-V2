import { useState, useEffect, useMemo } from 'react';
import { Search, Gamepad2, Maximize2, X, ExternalLink, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // In a real app, we might fetch this from an API
    setGames(gamesData);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Unblocked Hub</h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-transparent focus:bg-white focus:border-emerald-500 focus:border-2 focus:ring-emerald-500/20 rounded-xl transition-all outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-100 text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-100 text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid/List */}
        {filteredGames.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-3"
          }>
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className={`group cursor-pointer bg-white border border-zinc-200 overflow-hidden transition-all hover:shadow-xl hover:border-emerald-200 ${
                  viewMode === 'grid' ? 'rounded-2xl' : 'rounded-xl flex items-center p-3'
                }`}
                onClick={() => setSelectedGame(game)}
              >
                <div className={viewMode === 'grid' ? "aspect-video relative overflow-hidden" : "w-24 h-16 relative rounded-lg overflow-hidden flex-shrink-0"}>
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur p-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5 text-zinc-900" />
                    </div>
                  </div>
                </div>
                <div className={viewMode === 'grid' ? "p-4" : "ml-4 flex-1"}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
                        {game.category}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900">No games found</h3>
            <p className="text-zinc-500">Try adjusting your search or category</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <div 
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm"
              onClick={() => setSelectedGame(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-zinc-900">{selectedGame.title}</h2>
                    <p className="text-xs text-zinc-500">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-zinc-900 relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                  allow="autoplay; fullscreen; keyboard"
                />
              </div>

              <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Playing <span className="font-semibold text-zinc-700">{selectedGame.title}</span> • Unblocked Hub
                </p>
                <div className="flex gap-2">
                   {/* Placeholder for more controls if needed */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 p-1.5 rounded-lg">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-zinc-900">Unblocked Hub</span>
            </div>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Unblocked Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-zinc-600">
              <a href="#" className="hover:text-emerald-600 transition-colors">Games</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
