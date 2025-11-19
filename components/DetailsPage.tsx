import React from 'react';
import type { Anime } from '../types';
import { PlayIcon } from './icons';

interface DetailsPageProps {
  anime: Anime;
  onBack: () => void;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({ anime, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-96">
        <img src={anime.bannerUrl} alt={anime.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight shadow-lg">{anime.title}</h1>
        </div>
        <button onClick={onBack} className="absolute top-4 left-4 bg-gray-800/50 hover:bg-gray-700/70 p-2 rounded-full text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Episodes</h2>
            <div className="space-y-3">
              {anime.episodes.map((episode) => (
                <div key={episode.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-700/80 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-400 w-8 text-center">{episode.episodeNumber}</span>
                    <div>
                      <h3 className="font-semibold text-white">{episode.title}</h3>
                      <p className="text-sm text-gray-400">{episode.duration} min</p>
                    </div>
                  </div>
                  <a 
                    href={episode.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full transition-transform duration-200 hover:scale-105 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                    <PlayIcon className="w-5 h-5" />
                    <span>WATCH</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};