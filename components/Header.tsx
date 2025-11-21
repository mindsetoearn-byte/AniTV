

import React, { useState } from 'react';
import { Logo, SearchIcon, ChevronDownIcon, AdminIcon, LogoutIcon } from './icons';
import type { Page } from '../types';

export type FilterType = 'all' | 'series' | 'movies' | 'watchlist';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
    onOpenSearch: () => void;
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, isAuthenticated, onLogout, onOpenSearch, activeFilter, onFilterChange }) => {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const getButtonClass = (filter: FilterType) => {
        const baseClass = "text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-full text-sm font-medium";
        if (activeFilter === filter) {
            return `${baseClass} bg-purple-600 text-white`;
        }
        return `${baseClass} bg-gray-800/50 hover:bg-gray-700/70`;
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-50 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
                <Logo className="h-8 w-auto text-white cursor-pointer" onClick={() => onNavigate('home')}/>
                <nav className="hidden md:flex items-center space-x-4">
                    <button onClick={() => onFilterChange('watchlist')} className={getButtonClass('watchlist')}>Watchlist</button>
                    <button onClick={() => onFilterChange('series')} className={getButtonClass('series')}>Series</button>
                    <button onClick={() => onFilterChange('movies')} className={getButtonClass('movies')}>Movies</button>
                    <div className="relative">
                        <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-full text-sm font-medium bg-gray-800/50 hover:bg-gray-700/70">
                            Categories <ChevronDownIcon className="w-4 h-4 ml-1" />
                        </button>
                        {isCategoriesOpen && (
                            <div className="absolute mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 animate-fadeIn">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Action</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Adventure</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Comedy</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Fantasy</a>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={onOpenSearch} className="p-2 rounded-full hover:bg-gray-700" title="Search">
                    <SearchIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
                 {isAuthenticated ? (
                    <>
                        <button onClick={() => onNavigate('admin')} className="p-2 rounded-full hover:bg-gray-700" title="Admin Panel">
                            <AdminIcon className="w-6 h-6 text-purple-400" />
                        </button>
                        <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-700" title="Logout">
                            <LogoutIcon className="w-6 h-6 text-red-400" />
                        </button>
                    </>
                ) : (
                    <button onClick={() => onNavigate('login')} className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};