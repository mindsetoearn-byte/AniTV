// FIX: Removed typo 'a,' from react import to correctly import hooks.
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { SearchOverlay } from './components/SearchOverlay';
import type { Anime, Page } from './types';
import * as api from './services/api';
import { SpinnerIcon } from './components/icons';
import { GlobalAdLoader } from './components/GlobalAdLoader';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch initial data from the API (Firebase for anime, localStorage for watchlist)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setDbError(null);
      try {
        const [initialAnimeData, initialWatchlist] = await Promise.all([
          api.getAnimeData(),
          api.getWatchlist(),
        ]);
        setAnimeData(initialAnimeData);
        setWatchlist(initialWatchlist);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        if (error instanceof Error) {
            setDbError(error.message);
        } else {
            setDbError("An unknown error occurred while connecting to the database.");
        }
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
    try {
      await api.addAnime(newAnime);
      // Add to the top of the list for immediate feedback
      setAnimeData(prevData => [newAnime, ...prevData]);
    } catch (error) {
       if (error instanceof Error) setDbError(error.message);
    }
  };
  
  const handleUpdateAnime = async (updatedAnime: Anime) => {
    try {
        await api.updateAnime(updatedAnime);
        setAnimeData(prevData => prevData.map(anime => 
          anime.id === updatedAnime.id ? updatedAnime : anime
        ));
    } catch (error) {
       if (error instanceof Error) setDbError(error.message);
    }
  };

  const handleDeleteAnime = async (animeId: number) => {
    try {
        await api.deleteAnime(animeId);
        setAnimeData(prevData => prevData.filter(anime => anime.id !== animeId));
        
        // Also remove from local watchlist if deleted
        const updatedWatchlist = watchlist.filter(id => id !== animeId);
        setWatchlist(updatedWatchlist);
        await api.saveWatchlist(updatedWatchlist);
    } catch(error) {
        if (error instanceof Error) setDbError(error.message);
    }
  };

  const toggleWatchlist = async (animeId: number) => {
    const updatedWatchlist = watchlist.includes(animeId) 
      ? watchlist.filter(id => id !== animeId)
      : [...watchlist, animeId];
    
    setWatchlist(updatedWatchlist);
    await api.saveWatchlist(updatedWatchlist);
  };


  useEffect(() => {
    if (isLoading) return;

    if (currentPage === 'admin' && !isAuthenticated) {
      navigateTo('login');
    }
    
    if (currentPage === 'details' && !selectedAnime) {
      navigateTo('home');
    }
  }, [currentPage, isAuthenticated, selectedAnime, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <SpinnerIcon className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="ml-4 text-lg text-gray-300">Connecting to database...</p>
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
        navigateTo('home');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* This component loads the master script for Pop-unders, Social Bars, etc. */}
      <GlobalAdLoader />
      {dbError && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-[1000] text-sm shadow-lg">
          <strong>Database Connection Error:</strong> {dbError} You are viewing local data; changes will not be saved globally.
        </div>
      )}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        animeData={animeData}
        onSelectAnime={handleSelectAnime}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />
       <div key={currentPage} className={`animate-fadeIn ${dbError ? 'pt-12' : ''}`}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;