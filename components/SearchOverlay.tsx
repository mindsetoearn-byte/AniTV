
import React, { useState, useEffect } from 'react';
import type { Anime } from '../types';
import { AnimeCard } from './AnimeCard';
import { SearchIcon } from './icons';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  animeData: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, animeData, onSelectAnime }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Anime[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setIsVisible(true);
    } else {
        setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredData([]);
    } else {
      const lowercasedQuery = query.toLowerCase();
      setFilteredData(
        animeData.filter(anime =>
          anime.title.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [query, animeData]);
  
  // Reset query when overlay is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setQuery(''), 300); // Delay reset to allow fade out animation
    }
  }, [isOpen]);

  const handleSelect = (anime: Anime) => {
    onSelectAnime(anime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-gray-900/90 backdrop-blur-md z-[100] flex flex-col p-4 md:p-8 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div className="w-full max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for an anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-gray-800 border-2 border-gray-700 text-white text-lg pl-14 pr-14 py-4 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
          />
           <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
          {query.trim() !== '' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredData.length > 0 ? (
                filteredData.map((anime, index) => (
                  <div key={anime.id} className="animate-slideInUp" style={{ animationDelay: `${index * 50}ms` }}>
                    <AnimeCard anime={anime} onSelect={handleSelect} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400 text-lg py-10">No results found for "{query}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
