import React from 'react';
import type { Anime } from '../types';
import { AnimeCard } from './AnimeCard';
import { ChevronRightIcon, PlayIcon } from './icons';
import { Header } from './Header';
import type { Page } from '../App';


interface HomePageProps {
    animeData: Anime[];
    featuredAnime: Anime;
    onSelectAnime: (anime: Anime) => void;
    onNavigate: (page: Page) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
}

const ContentRow: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-12">
        <div className="flex items-center justify-between mb-4 px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button className="flex items-center text-sm text-purple-400 hover:text-purple-300">
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 md:px-8 -mb-4">
            {children}
        </div>
    </section>
);

const Hero: React.FC<{ anime: Anime, onSelectAnime: (anime: Anime) => void; }> = ({ anime, onSelectAnime }) => (
    <div className="relative h-[60vh] md:h-[70vh] w-full mb-8">
        <img src={anime.bannerUrl} alt={anime.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-8">
            <p className="text-lg font-bold text-purple-400">0{anime.currentEpisodes}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl my-2">{anime.title}</h1>
            <button 
                onClick={() => onSelectAnime(anime)}
                className="mt-4 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full w-48 transition-transform duration-200 hover:scale-105"
            >
                <PlayIcon className="w-6 h-6" />
                <span>Watch Now</span>
            </button>
        </div>
    </div>
);


export const HomePage: React.FC<HomePageProps> = ({ animeData, featuredAnime, onSelectAnime, onNavigate, isAuthenticated, onLogout }) => {
    return (
        <div className="bg-gray-900 min-h-screen">
            <Header onNavigate={onNavigate} isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <main className="pt-20">
                <Hero anime={featuredAnime} onSelectAnime={onSelectAnime} />
                <ContentRow title="Recently Updated">
                    {animeData.slice(0, 5).map(anime => (
                        <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
                    ))}
                </ContentRow>
                <ContentRow title="New on AniTV">
                    {animeData.slice(1).map(anime => (
                        <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
                    ))}
                </ContentRow>
            </main>
        </div>
    );
};