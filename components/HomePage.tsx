

import React, { useState, useEffect } from 'react';
import type { Anime } from '../types';
import { AnimeCard } from './AnimeCard';
import { ChevronRightIcon, PlayIcon } from './icons';
import { Header, FilterType } from './Header';
import type { Page } from '../types';
import { DisplayAd } from './DisplayAd';

interface HomePageProps {
    animeData: Anime[];
    onSelectAnime: (anime: Anime) => void;
    onNavigate: (page: Page) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
    onOpenSearch: () => void;
    watchlist: number[];
    onToggleWatchlist: (animeId: number) => void;
}

const ContentRow: React.FC<{ title: string; children: React.ReactNode; isEmpty?: boolean; emptyMessage?: string; }> = ({ title, children, isEmpty = false, emptyMessage = "No anime to display." }) => (
    <section className="mb-12">
        <div className="flex items-center justify-between mb-4 px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white animate-slideInRight" style={{ animationDelay: '200ms' }}>{title}</h2>
            <button className="flex items-center text-sm text-purple-400 hover:text-purple-300">
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
        {isEmpty ? (
            <div className="px-4 md:px-8 text-gray-400">{emptyMessage}</div>
        ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 px-4 md:px-8 -mb-4">
                {children}
            </div>
        )}
    </section>
);


const Hero: React.FC<{ 
    anime: Anime, 
    onSelectAnime: (anime: Anime) => void; 
    featuredCount: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
}> = ({ anime, onSelectAnime, featuredCount, activeIndex, onDotClick }) => (
    <div className="relative h-[60vh] md:h-[70vh] w-full mb-8">
        <img src={anime.bannerUrl} alt={anime.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div key={anime.id} className="relative z-10 flex flex-col justify-end h-full p-4 md:p-8 animate-fadeIn">
            <p className="text-lg font-bold text-purple-400 animate-slideInUp" style={{ animationDelay: '100ms' }}>0{anime.currentEpisodes}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl my-2 animate-slideInUp" style={{ animationDelay: '200ms' }}>{anime.title}</h1>
            <button 
                onClick={() => onSelectAnime(anime)}
                className="mt-4 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full w-48 transition-transform duration-200 hover:scale-105 animate-slideInUp"
                style={{ animationDelay: '300ms' }}
            >
                <PlayIcon className="w-6 h-6" />
                <span>Watch Now</span>
            </button>
        </div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {Array.from({ length: featuredCount }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-purple-500' : 'w-2 bg-gray-500 hover:bg-gray-300'}`}
                />
            ))}
        </div>
    </div>
);

export const HomePage: React.FC<HomePageProps> = ({ animeData, onSelectAnime, onNavigate, isAuthenticated, onLogout, onOpenSearch, watchlist, onToggleWatchlist }) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const featuredItems = animeData.slice(0, 4);

    useEffect(() => {
        if (featuredItems.length <= 1) return;

        const timer = setInterval(() => {
            setActiveHeroIndex(prevIndex => (prevIndex + 1) % featuredItems.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [featuredItems.length]);

    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
    };
    
    const handleNavigate = (page: Page) => {
      if (page === 'home') {
        setFilter('all');
      }
      onNavigate(page);
    };

    const displayedData = animeData.filter(anime => {
        if (filter === 'watchlist') return watchlist.includes(anime.id);
        if (filter === 'series') return anime.type === 'TV' || anime.type === 'ONA';
        if (filter === 'movies') return anime.type === 'Movie';
        return true; // 'all'
    });

    const renderAnimeCards = (data: Anime[]) => {
      return data.map((anime, index) => (
          <div key={anime.id} className="animate-slideInUp" style={{ animationDelay: `${index * 100 + 300}ms` }}>
              <AnimeCard 
                  anime={anime} 
                  onSelect={onSelectAnime} 
                  isOnWatchlist={watchlist.includes(anime.id)}
                  onToggleWatchlist={onToggleWatchlist}
              />
          </div>
      ));
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <Header 
                onNavigate={handleNavigate} 
                isAuthenticated={isAuthenticated} 
                onLogout={onLogout} 
                onOpenSearch={onOpenSearch}
                activeFilter={filter}
                onFilterChange={handleFilterChange}
            />
            <main className="pt-20">
               
                {featuredItems.length > 0 && (
                    <Hero 
                        anime={featuredItems[activeHeroIndex]} 
                        onSelectAnime={onSelectAnime}
                        featuredCount={featuredItems.length}
                        activeIndex={activeHeroIndex}
                        onDotClick={(index) => setActiveHeroIndex(index)}
                    />
                )}
                
                {filter === 'watchlist' ? (
                     <ContentRow title="My Watchlist" isEmpty={displayedData.length === 0} emptyMessage="Your watchlist is empty. Add shows by clicking the bookmark icon.">
                        {renderAnimeCards(displayedData)}
                    </ContentRow>
                ) : (
                    <>
                        <ContentRow title="Recently Updated">
                            {renderAnimeCards(displayedData.slice(0, 6))}
                        </ContentRow>
                        
                        <div className="px-4 md:px-8 my-8 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                            <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
                            <DisplayAd
                                // IMPORTANT: Replace with your own "Display Ad" unit Slot ID from AdSense
                                adSlot="3629209692" 
                                publisherId="ca-pub-6981566320201426"
                                className="min-h-[100px]"
                            />
                        </div>

                        <ContentRow title="New on AniTV">
                             {renderAnimeCards(displayedData.slice(6, 12))}
                        </ContentRow>
                    </>
                )}
            </main>
        </div>
    );
};