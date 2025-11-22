import type { Anime } from '../types';
import { mockAnimeData } from '../data/mockData';
import { getFirestore } from '../firebase';

const WATCHLIST_KEY = 'animeTVWatchlist';
const ANIME_COLLECTION = 'anime';

// This function seeds the database with initial data if it's empty.
const seedDatabase = async () => {
    const firestore = await getFirestore();
    console.log("Seeding database with initial mock data...");
    const batch = firestore.batch();
    mockAnimeData.forEach(anime => {
        const docRef = firestore.collection(ANIME_COLLECTION).doc(String(anime.id));
        batch.set(docRef, anime);
    });
    await batch.commit();
    return mockAnimeData;
};

// --- ANIME DATA API (FIRESTORE) ---

export const getAnimeData = async (): Promise<Anime[]> => {
    try {
        const firestore = await getFirestore();
        const snapshot = await firestore.collection(ANIME_COLLECTION).get();
        if (snapshot.empty) {
            return await seedDatabase();
        }
        
        const animeData = snapshot.docs.map(doc => doc.data() as Anime);
        return animeData.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.error("Error fetching anime data from Firestore:", error);
        // Fallback to mock data if Firestore fails and throw an error for the UI to catch
        throw new Error("Could not connect to the database. Displaying local data.");
    }
};

export const addAnime = async (anime: Anime): Promise<void> => {
    try {
        const firestore = await getFirestore();
        const docRef = firestore.collection(ANIME_COLLECTION).doc(String(anime.id));
        await docRef.set(anime);
    } catch (error) {
        console.error("Error adding anime to Firestore:", error);
        throw new Error("Failed to save new anime to the database.");
    }
};

export const updateAnime = async (anime: Anime): Promise<void> => {
    try {
        const firestore = await getFirestore();
        const docRef = firestore.collection(ANIME_COLLECTION).doc(String(anime.id));
        await docRef.update(anime);
    } catch (error) {
        console.error("Error updating anime in Firestore:", error);
        throw new Error("Failed to update anime in the database.");
    }
};

export const deleteAnime = async (animeId: number): Promise<void> => {
    try {
        const firestore = await getFirestore();
        const docRef = firestore.collection(ANIME_COLLECTION).doc(String(animeId));
        await docRef.delete();
    } catch (error) {
        console.error("Error deleting anime from Firestore:", error);
        throw new Error("Failed to delete anime from the database.");
    }
};


// --- WATCHLIST API (LOCALSTORAGE - User Specific) ---

export const getWatchlist = async (): Promise<number[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // simulate small delay
    try {
        const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
        console.error("Could not parse watchlist from localStorage", error);
        return [];
    }
};

export const saveWatchlist = async (watchlist: number[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // simulate small delay
    try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error("Could not save watchlist to localStorage", error);
    }
};