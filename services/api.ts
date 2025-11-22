import type { Anime } from '../types';
import { mockAnimeData } from '../data/mockData';

const ANIME_DATA_KEY = 'animeTVData';
const WATCHLIST_KEY = 'animeTVWatchlist';
const SIMULATED_DELAY = 200; // ms

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- ANIME DATA API ---

export const getAnimeData = async (): Promise<Anime[]> => {
    await delay(SIMULATED_DELAY);
    try {
        const savedData = localStorage.getItem(ANIME_DATA_KEY);
        // If there's saved data, parse and return it. Otherwise, return the initial mock data.
        return savedData ? JSON.parse(savedData) : mockAnimeData;
    } catch (error) {
        console.error("Could not parse anime data from localStorage", error);
        // Fallback to mock data in case of parsing error
        return mockAnimeData;
    }
};

export const saveAnimeData = async (data: Anime[]): Promise<void> => {
    await delay(SIMULATED_DELAY);
    try {
        localStorage.setItem(ANIME_DATA_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Could not save anime data to localStorage", error);
    }
};

// --- WATCHLIST API ---

export const getWatchlist = async (): Promise<number[]> => {
    await delay(SIMULATED_DELAY);
    try {
        const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
        // If there's a saved watchlist, parse and return it. Otherwise, return an empty array.
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
        console.error("Could not parse watchlist from localStorage", error);
        // Fallback to an empty array in case of error
        return [];
    }
};

export const saveWatchlist = async (watchlist: number[]): Promise<void> => {
    await delay(SIMULATED_DELAY);
    try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error("Could not save watchlist to localStorage", error);
    }
};
