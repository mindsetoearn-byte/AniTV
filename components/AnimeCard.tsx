
import React from 'react';
import type { Anime } from '../types';
import { VideoCameraIcon, DocumentDuplicateIcon } from './icons';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  return (
    <div 
      className="flex-shrink-0 w-40 md:w-48 group cursor-pointer"
      onClick={() => onSelect(anime)}
    >
      <div className="relative rounded-lg overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-600/30">
        <img src={anime.posterUrl} alt={anime.title} className="w-full h-60 md:h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white w-full">
            <div className="flex items-center space-x-2 text-xs text-gray-300">
                <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <VideoCameraIcon className="w-3 h-3" />
                    <span>{anime.currentEpisodes}</span>
                </div>
                 <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <DocumentDuplicateIcon className="w-3 h-3" />
                    <span>{anime.totalEpisodes}</span>
                </div>
            </div>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-gray-200 group-hover:text-purple-400 truncate transition-colors duration-200">{anime.title}</h3>
      <p className="text-xs text-gray-400">{anime.type} • 20m</p>
    </div>
  );
};
