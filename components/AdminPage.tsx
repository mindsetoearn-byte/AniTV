import React, { useState, useEffect } from 'react';
import type { Anime, Episode } from '../types';
import { LogoutIcon } from './icons';

interface AdminPageProps {
    animeData: Anime[];
    onAddAnime: (anime: Anime) => void;
    onUpdateAnime: (anime: Anime) => void;
    onDeleteAnime: (animeId: number) => void;
    onLogout: () => void;
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

    useEffect(() => {
        // If an anime is updated in the main list, refresh the form data
        if (selectedAnime) {
            const updatedAnime = animeData.find(a => a.id === selectedAnime.id);
            if (updatedAnime) {
                setSelectedAnime(JSON.parse(JSON.stringify(updatedAnime)));
            } else {
                // If the selected anime was deleted, close the form
                setSelectedAnime(null);
            }
        }
    }, [animeData]);

    const handleSelectAnime = (anime: Anime) => {
        setIsCreatingNew(false);
        // Deep copy to prevent direct mutation of state
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
    };

    const removeEpisode = (index: number) => {
        if (!selectedAnime) return;
        const updatedEpisodes = selectedAnime.episodes.filter((_, i) => i !== index);
        setSelectedAnime(prev => prev ? { ...prev, episodes: updatedEpisodes } : null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAnime) return;
        
        const animeToSave: Anime = {
            ...selectedAnime,
            // Ensure episode numbers are sequential
            episodes: selectedAnime.episodes.map((ep, i) => ({...ep, episodeNumber: i + 1})),
        };
        
        if (isCreatingNew) {
            onAddAnime(animeToSave);
        } else {
            onUpdateAnime(animeToSave);
        }
        setSelectedAnime(null);
        setIsCreatingNew(false);
    };

    const handleDelete = (animeId: number) => {
        onDeleteAnime(animeId);
        if (selectedAnime?.id === animeId) {
            setSelectedAnime(null);
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

            {/* Episode Management */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Episodes</h3>
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
                 <button onClick={addEpisode} type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition">+ Add Episode</button>
            </div>
           
            <div className="flex space-x-4">
                <button type="submit" className="flex-grow bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition">{isCreatingNew ? 'Create Anime' : 'Save Changes'}</button>
                <button onClick={() => setSelectedAnime(null)} type="button" className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md mt-0 transition">Cancel</button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Admin Panel</h1>
                <button onClick={onLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition">
                    <LogoutIcon className="w-5 h-5"/> <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Anime List */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-2xl font-semibold mb-4">Manage Anime</h2>
                    <button onClick={handleAddNewClick} className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition">+ Add New Anime</button>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {animeData.map(anime => (
                            <div key={anime.id} className={`bg-gray-700 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedAnime?.id === anime.id ? 'ring-2 ring-purple-500 scale-105' : 'hover:bg-gray-600'}`} >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-md">{anime.title}</p>
                                        <p className="text-xs text-gray-400">{anime.type} - {anime.currentEpisodes}/{anime.totalEpisodes} Eps</p>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 mt-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleSelectAnime(anime); }} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md">Edit</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(anime.id); }} className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Area */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                    {selectedAnime ? (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">{isCreatingNew ? 'Create New Anime' : `Editing: ${selectedAnime.title}`}</h2>
                            {renderForm()}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                             <h2 className="text-2xl font-semibold mb-4">Welcome to the Admin Panel</h2>
                            <p>Select an anime from the list to edit, or add a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};