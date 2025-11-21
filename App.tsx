import React, { useState, useEffect, useCallback } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { SearchOverlay } from './components/SearchOverlay';
import { mockAnimeData } from './data/mockData';
import type { Anime, Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Load initial data from localStorage or fall back to mock data
  const [animeData, setAnimeData] = useState<Anime[]>(() => {
    try {
      const savedData = localStorage.getItem('animeTVData');
      return savedData ? JSON.parse(savedData) : mockAnimeData;
    } catch (error) {
      console.error("Could not parse anime data from localStorage", error);
      return mockAnimeData;
    }
  });
  
  // Load initial watchlist from localStorage or fall back to an empty array
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    try {
      const savedWatchlist = localStorage.getItem('animeTVWatchlist');
      return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
      console.error("Could not parse watchlist from localStorage", error);
      return [];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save anime data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('animeTVData', JSON.stringify(animeData));
    } catch (error) {
      console.error("Could not save anime data to localStorage", error);
    }
  }, [animeData]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('animeTVWatchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error("Could not save watchlist to localStorage", error);
    }
  }, [watchlist]);


  const navigateTo = useCallback((page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  }, []);

  const handleSelectAnime = useCallback((anime: Anime) => {
    setIsSearchOpen(false);
    setSelectedAnime(anime);
    navigateTo('details');
  }, [navigateTo]);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    navigateTo('admin');
  }, [navigateTo]);
  
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    navigateTo('home');
  }, [navigateTo]);

  const handleAddAnime = (newAnime: Anime) => {
    setAnimeData(prevData => [newAnime, ...prevData]);
  };
  
  const handleUpdateAnime = (updatedAnime: Anime) => {
    setAnimeData(prevData => 
      prevData.map(anime => 
        anime.id === updatedAnime.id ? updatedAnime : anime
      )
    );
  };

  const handleDeleteAnime = (animeId: number) => {
    setAnimeData(prevData => prevData.filter(anime => anime.id !== animeId));
    setWatchlist(prev => prev.filter(id => id !== animeId)); // Also remove from watchlist if deleted
  };

  const toggleWatchlist = useCallback((animeId: number) => {
    setWatchlist(prev => 
      prev.includes(animeId) 
        ? prev.filter(id => id !== animeId)
        : [...prev, animeId]
    );
  }, []);


  // This effect handles page navigation logic that depends on the current state.
  // It prevents calling state setters during the render phase, which causes crashes.
  useEffect(() => {
    // If trying to access admin page while not authenticated, redirect to login
    if (currentPage === 'admin' && !isAuthenticated) {
      navigateTo('login');
    }
    
    // If on the details page but no anime is selected, redirect to home
    if (currentPage === 'details' && !selectedAnime) {
      navigateTo('home');
    }
  }, [currentPage, isAuthenticated, selectedAnime, navigateTo]);

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
        // The useEffect handles the redirect if selectedAnime is null.
        // So we only need to render the page if the data is present.
        return selectedAnime ? <DetailsPage anime={selectedAnime} onBack={() => navigateTo('home')} /> : null;
      case 'login':
        return <LoginPage onSuccess={handleLoginSuccess} onBack={() => navigateTo('home')}/>;
      case 'admin':
        // The useEffect handles the redirect if not authenticated.
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
