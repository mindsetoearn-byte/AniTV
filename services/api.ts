import type { Anime } from '../types';
import { mockAnimeData } from '../data/mockData';
import { getFirestore } from '../firebase';

const WATCHLIST_KEY = 'animeTVWatchlist';
const ANIME_COLLECTION = 'anime';

// --- ANIME DATA API (FIRESTORE) ---

// This function seeds the database with initial data if it's empty.
const seedDatabase = async () => {
    const firestore = await getFirestore(); // Get instance inside the function
    console.log("Seeding database with initial mock data...");
    const batch = firestore.batch();
    mockAnimeData.forEach(anime => {
        // Use anime ID as the document ID for easy lookup
        const docRef = firestore.collection(ANIME_COLLECTION).doc(String(anime.id));
        batch.set(docRef, anime);
    });
    await batch.commit();
    return mockAnimeData;
};

export const getAnimeData = async (): Promise<Anime[]> => {
    try {
        const firestore = await getFirestore(); // Get instance inside the function
        const snapshot = await firestore.collection(ANIME_COLLECTION).get();
        if (snapshot.empty) {
            // If the database is empty, seed it with mock data.
            // This is a one-time operation for the first user.
            return await seedDatabase();
        }
        
        const animeData = snapshot.docs.map(doc => doc.data() as Anime);
        // Sort by ID to maintain a consistent order, assuming higher ID is newer.
        return animeData.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.error("Error fetching anime data from Firestore:", error);
        // Fallback to mock data if Firestore fails
        alert("Could not connect to the database. Displaying local data. Please check your Firebase setup and internet connection.");
        return mockAnimeData;
    }
};

export const saveAnimeData = async (data: Anime[]): Promise<void> => {
    try {
        const firestore = await getFirestore(); // Get instance inside the function
        const batch = firestore.batch();
        const existingDocsSnapshot = await firestore.collection(ANIME_COLLECTION).get();
        const existingIds = new Set(existingDocsSnapshot.docs.map(doc => doc.id));
        
        data.forEach(anime => {
            const docRef = firestore.collection(ANIME_COLLECTION).doc(String(anime.id));
            batch.set(docRef, anime);
            existingIds.delete(String(anime.id));
        });

        // Delete any anime that are no longer in the new data array
        existingIds.forEach(idToDelete => {
             const docRef = firestore.collection(ANIME_COLLECTION).doc(idToDelete);
             batch.delete(docRef);
        });

        await batch.commit();
    } catch (error) {
        console.error("Error saving anime data to Firestore:", error);
        alert("Failed to save data to the database. Please check your Firebase setup and internet connection.");
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