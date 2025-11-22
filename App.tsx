import React, { useState, useEffect, useCallback } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { SearchOverlay } from './components/SearchOverlay';
import type { Anime, Page } from './types';
import * as api from './services/api';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch initial data from the simulated API on startup
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [initialAnimeData, initialWatchlist] = await Promise.all([
          api.getAnimeData(),
          api.getWatchlist(),
        ]);
        setAnimeData(initialAnimeData);
        setWatchlist(initialWatchlist);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSelectAnime = (anime: Anime) => {
    setIsSearchOpen(false);
    setSelectedAnime(anime);
    navigateTo('details');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigateTo('admin');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigateTo('home');
  };

  const handleAddAnime = async (newAnime: Anime) => {
    const updatedData = [newAnime, ...animeData];
    setAnimeData(updatedData);
    await api.saveAnimeData(updatedData);
  };
  
  const handleUpdateAnime = async (updatedAnime: Anime) => {
    const updatedData = animeData.map(anime => 
      anime.id === updatedAnime.id ? updatedAnime : anime
    );
    setAnimeData(updatedData);
    await api.saveAnimeData(updatedData);
  };

  const handleDeleteAnime = async (animeId: number) => {
    const updatedData = animeData.filter(anime => anime.id !== animeId);
    setAnimeData(updatedData);
    await api.saveAnimeData(updatedData);
    
    // Also remove from watchlist if deleted
    const updatedWatchlist = watchlist.filter(id => id !== animeId);
    setWatchlist(updatedWatchlist);
    await api.saveWatchlist(updatedWatchlist);
  };

  const toggleWatchlist = async (animeId: number) => {
    const updatedWatchlist = watchlist.includes(animeId) 
      ? watchlist.filter(id => id !== animeId)
      : [...watchlist, animeId];
    
    setWatchlist(updatedWatchlist);
    await api.saveWatchlist(updatedWatchlist);
  };


  // This effect handles page navigation logic that depends on the current state.
  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    if (currentPage === 'admin' && !isAuthenticated) {
      navigateTo('login');
    }
    
    if (currentPage === 'details' && !selectedAnime) {
      navigateTo('home');
    }
  }, [currentPage, isAuthenticated, selectedAnime, navigateTo, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <SpinnerIcon className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
                  animeData={animeData} 
                  onSelectAnime={handleSelectAnime} 
                  onNavigate={navigateTo} 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
               />;
      case 'details':
        return selectedAnime ? <DetailsPage anime={selectedAnime} onBack={() => navigateTo('home')} /> : null;
      case 'login':
        return <LoginPage onSuccess={handleLoginSuccess} onBack={() => navigateTo('home')}/>;
      case 'admin':
        return isAuthenticated ? <AdminPage 
            animeData={animeData}
            onAddAnime={handleAddAnime}
            onUpdateAnime={handleUpdateAnime}
            onDeleteAnime={handleDeleteAnime}
            onLogout={handleLogout} 
            onNavigate={navigateTo}
        /> : null;
      default:
        return <HomePage 
                  animeData={animeData} 
                  onSelectAnime={handleSelectAnime} 
                  onNavigate={navigateTo} 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        animeData={animeData}
        onSelectAnime={handleSelectAnime}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />
       <div key={currentPage} className="animate-fadeIn">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
