
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { SearchOverlay } from './components/SearchOverlay';
import { mockAnimeData } from './data/mockData';
import type { Anime } from './types';

export type Page = 'home' | 'details' | 'login' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [animeData, setAnimeData] = useState<Anime[]>(mockAnimeData);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


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

  const handleAddAnime = (newAnime: Anime) => {
    setAnimeData(prevData => [newAnime, ...prevData]);
  };
  
  const handleUpdateAnime = (updatedAnime: Anime) => {
    const newData = animeData.map(anime => anime.id === updatedAnime.id ? updatedAnime : anime);
    setAnimeData(newData);
  };

  const handleDeleteAnime = (animeId: number) => {
    const newData = animeData.filter(anime => anime.id !== animeId);
    setAnimeData(newData);
  };

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
  }, [currentPage, isAuthenticated, selectedAnime]);

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
        /> : null;
      default:
        return <HomePage 
                  animeData={animeData} 
                  onSelectAnime={handleSelectAnime} 
                  onNavigate={navigateTo} 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  onOpenSearch={() => setIsSearchOpen(true)}
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
      />
       <div key={currentPage} className="animate-fadeIn">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
