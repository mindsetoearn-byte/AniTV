
import React, { useState, useEffect } from 'react';
import type { Anime, Episode } from '../types';
import { LogoutIcon, SpinnerIcon, CheckCircleIcon } from './icons';

interface AdminPageProps {
    animeData: Anime[];
    onAddAnime: (anime: Anime) => void;
    onUpdateAnime: (anime: Anime) => void;
    onDeleteAnime: (animeId: number) => void;
    onLogout: () => void;
}

interface Toast {
  id: number;
  message: string;
}

const createNewAnime = (): Anime => ({
    id: Date.now(),
    title: '',
    synopsis: '',
    posterUrl: '',
    bannerUrl: '',
    type: 'TV',
    totalEpisodes: 0,
    currentEpisodes: 0,
    episodes: [],
});

export const AdminPage: React.FC<AdminPageProps> = ({ animeData, onAddAnime, onUpdateAnime, onDeleteAnime, onLogout }) => {
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        if (selectedAnime && !isCreatingNew) {
            const animeExistsInParent = animeData.some(a => a.id === selectedAnime.id);
            if (!animeExistsInParent) {
                setSelectedAnime(null);
            }
        }
    }, [animeData]);


    const showToast = (message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const handleSelectAnime = (anime: Anime) => {
        setIsCreatingNew(false);
        setSelectedAnime(JSON.parse(JSON.stringify(anime)));
    };

    const handleAddNewClick = () => {
        setSelectedAnime(createNewAnime());
        setIsCreatingNew(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!selectedAnime) return;
        const { name, value } = e.target;
        setSelectedAnime(prev => prev ? { ...prev, [name]: (name === 'totalEpisodes' || name === 'currentEpisodes') ? parseInt(value) || 0 : value } : null);
    };

    const handleEpisodeChange = (index: number, field: keyof Episode, value: string | number) => {
        if (!selectedAnime) return;
        const updatedEpisodes = [...selectedAnime.episodes];
        const episodeToUpdate = { ...updatedEpisodes[index] };
        
        if (field === 'duration' || field === 'episodeNumber') {
            episodeToUpdate[field] = parseInt(value as string) || 0;
        } else {
            (episodeToUpdate[field] as string) = value as string;
        }

        updatedEpisodes[index] = episodeToUpdate;
        setSelectedAnime(prev => prev ? { ...prev, episodes: updatedEpisodes } : null);
    };
    
    const addEpisode = () => {
        if (!selectedAnime) return;
        const newEpisode: Episode = {
            id: Date.now(),
            episodeNumber: selectedAnime.episodes.length + 1,
            title: `Episode ${selectedAnime.episodes.length + 1}`,
            duration: 24,
            watchUrl: ''
        };
        setSelectedAnime(prev => prev ? { ...prev, episodes: [...prev.episodes, newEpisode] } : null);
        showToast("Episode added. Don't forget to save.");
    };

    const removeEpisode = (index: number) => {
        if (!selectedAnime) return;
        const updatedEpisodes = selectedAnime.episodes.filter((_, i) => i !== index);
        setSelectedAnime(prev => prev ? { ...prev, episodes: updatedEpisodes } : null);
        showToast("Episode removed. Don't forget to save.");
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAnime) return;
        setIsSaving(true);
        
        const animeToSave: Anime = {
            ...selectedAnime,
            episodes: selectedAnime.episodes.map((ep, i) => ({...ep, episodeNumber: i + 1})),
        };
        
        // Simulate network delay
        setTimeout(() => {
            if (isCreatingNew) {
                onAddAnime(animeToSave);
                showToast('Anime created successfully!');
            } else {
                onUpdateAnime(animeToSave);
                showToast('Anime updated successfully!');
            }
            setSelectedAnime(null);
            setIsCreatingNew(false);
            setIsSaving(false);
        }, 500);
    };

    const handleDelete = (animeId: number) => {
        if (window.confirm('Are you sure you want to delete this anime? This action cannot be undone.')) {
            onDeleteAnime(animeId);
            if (selectedAnime?.id === animeId) {
                setSelectedAnime(null);
            }
            showToast('Anime deleted successfully.');
        }
    }

    const renderForm = () => (
        <form onSubmit={handleSave} className="space-y-6">
            <input name="title" value={selectedAnime!.title} onChange={handleFormChange} placeholder="Title" className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition" required />
            <textarea name="synopsis" value={selectedAnime!.synopsis} onChange={handleFormChange} placeholder="Synopsis" className="w-full bg-gray-700 p-3 rounded-md h-28 focus:ring-2 focus:ring-purple-500 outline-none transition" required />
            <input name="posterUrl" value={selectedAnime!.posterUrl} onChange={handleFormChange} placeholder="Poster URL" className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition" required />
            <input name="bannerUrl" value={selectedAnime!.bannerUrl} onChange={handleFormChange} placeholder="Banner URL" className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="type" value={selectedAnime!.type} onChange={handleFormChange} className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition">
                    <option value="TV">TV</option> <option value="ONA">ONA</option> <option value="Movie">Movie</option>
                </select>
                <input type="number" name="currentEpisodes" value={selectedAnime!.currentEpisodes} onChange={handleFormChange} placeholder="Current Episodes" className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition" required />
                <input type="number" name="totalEpisodes" value={selectedAnime!.totalEpisodes} onChange={handleFormChange} placeholder="Total Episodes" className="w-full bg-gray-700 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition" required />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Episodes</h3>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                    {selectedAnime!.episodes.map((ep, index) => (
                        <div key={ep.id} className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="font-bold">Episode {ep.episodeNumber}</p>
                                <button onClick={() => removeEpisode(index)} type="button" className="text-red-400 hover:text-red-300 text-sm font-semibold">Remove</button>
                            </div>
                            <input value={ep.title} onChange={e => handleEpisodeChange(index, 'title', e.target.value)} placeholder="Episode Title" className="w-full bg-gray-600 p-2 rounded-md" />
                            <input value={ep.watchUrl} onChange={e => handleEpisodeChange(index, 'watchUrl', e.target.value)} placeholder="Watch URL" className="w-full bg-gray-600 p-2 rounded-md" />
                            <input type="number" value={ep.duration} onChange={e => handleEpisodeChange(index, 'duration', e.target.value)} placeholder="Duration (min)" className="w-full bg-gray-600 p-2 rounded-md" />
                        </div>
                    ))}
                </div>
                 <button onClick={addEpisode} type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add Episode
                 </button>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setSelectedAnime(null)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center w-28 disabled:bg-purple-800">
                    {isSaving ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : 'Save'}
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-800 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <button onClick={onLogout} className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-md">
                        <LogoutIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-gray-900 p-4 rounded-lg">
                        <button onClick={handleAddNewClick} className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            + Add New Anime
                        </button>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                           {animeData.map(anime => (
                               <div key={anime.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-md hover:bg-gray-700/70 cursor-pointer" onClick={() => handleSelectAnime(anime)}>
                                   <p className="font-semibold truncate">{anime.title}</p>
                                   <button onClick={(e) => { e.stopPropagation(); handleDelete(anime.id); }} className="text-gray-400 hover:text-red-400 ml-2 text-xs">Delete</button>
                               </div>
                           ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-gray-900 p-6 rounded-lg">
                        {selectedAnime ? renderForm() : <div className="text-center text-gray-400 h-full flex items-center justify-center"><p>Select an anime to edit or add a new one.</p></div>}
                    </div>
                </div>
            </div>
            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className="bg-gray-800 border border-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
                         <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
