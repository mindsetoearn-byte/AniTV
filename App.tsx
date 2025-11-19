
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DetailsPage } from './components/DetailsPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { mockAnimeData, mockFeaturedAnime } from './data/mockData';
import type { Anime } from './types';

export type Page = 'home' | 'details' | 'login' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [animeData, setAnimeData] = useState<Anime[]>(mockAnimeData);
  const [featuredAnime, setFeaturedAnime] = useState<Anime>(mockFeaturedAnime);


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
    setAnimeData(prevData => prevData.map(anime => anime.id === updatedAnime.id ? updatedAnime : anime));
    alert('Anime updated successfully!');
  };

  const handleDeleteAnime = (animeId: number) => {
    if(window.confirm('Are you sure you want to delete this anime?')) {
        setAnimeData(prevData => prevData.filter(anime => anime.id !== animeId));
        alert('Anime deleted successfully!');
    }
  };

  // Navigate to login page when trying to access admin without auth
  useEffect(() => {
    if (currentPage === 'admin' && !isAuthenticated) {
      navigateTo('login');
    }
  }, [currentPage, isAuthenticated]);

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
        if (selectedAnime) {
          return <DetailsPage anime={selectedAnime} onBack={() => navigateTo('home')} />;
        }
        // Fallback to home if no anime is selected
        navigateTo('home');
        return null;
      case 'login':
        return <LoginPage onSuccess={handleLoginSuccess} onBack={() => navigateTo('home')}/>;
      case 'admin':
        if(isAuthenticated) {
            return <AdminPage 
                animeData={animeData}
                onAddAnime={handleAddAnime}
                onUpdateAnime={handleUpdateAnime}
                onDeleteAnime={handleDeleteAnime}
                onLogout={handleLogout} 
            />;
        }
        navigateTo('login');
        return null;
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
