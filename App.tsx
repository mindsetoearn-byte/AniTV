
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { mockAnimeData } from './data/mockData';
import type { Anime } from './types';

export type Page = 'home' | 'details' | 'login' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [animeData, setAnimeData] = useState<Anime[]>(mockAnimeData);
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(
    mockAnimeData.length > 0 ? mockAnimeData[0] : null
  );


  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleSelectAnime = (anime: Anime) => {
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
    alert('Anime added successfully!');
    navigateTo('admin');
  };
  
  const handleUpdateAnime = (updatedAnime: Anime) => {
    const newData = animeData.map(anime => anime.id === updatedAnime.id ? updatedAnime : anime);
    setAnimeData(newData);
    
    if (featuredAnime && featuredAnime.id === updatedAnime.id) {
        setFeaturedAnime(updatedAnime);
    }
    alert('Anime updated successfully!');
  };

  const handleDeleteAnime = (animeId: number) => {
    if(window.confirm('Are you sure you want to delete this anime?')) {
        const newData = animeData.filter(anime => anime.id !== animeId);
        setAnimeData(newData);
        
        if (featuredAnime && featuredAnime.id === animeId) {
            setFeaturedAnime(newData.length > 0 ? newData[0] : null);
        }
        alert('Anime deleted successfully!');
    }
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
                  featuredAnime={featuredAnime}
                  onSelectAnime={handleSelectAnime} 
                  onNavigate={navigateTo} 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
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
                  featuredAnime={featuredAnime}
                  onSelectAnime={handleSelectAnime} 
                  onNavigate={navigateTo} 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {renderPage()}
    </div>
  );
};

export default App;
