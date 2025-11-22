// This file is used to initialize the Firebase SDK with your project's configuration.

// --- STEP 1: PASTE YOUR FIREBASE CONFIGURATION HERE ---
// Follow the setup guide to create a Firebase project and get your config object.
const firebaseConfig = {
  apiKey: "AIzaSyBYMq-teR5ujVHlSv3HHlqAxHBNa8Hee0M",
  authDomain: "anitv-719d1.firebaseapp.com",
  projectId: "anitv-719d1",
  storageBucket: "anitv-719d1.firebasestorage.app",
  messagingSenderId: "77686396030",
  appId: "1:77686396030:web:ce032b8d4eea88e1ba742f",
  measurementId: "G-R78LNN4DX5"
};


// --- No need to edit below this line ---

// --- SDK Loading ---
// We use a promise to ensure the SDK is only loaded once.
let sdkLoadedPromise: Promise<void> | null = null;

const loadFirebaseSDK = (): Promise<void> => {
    if (sdkLoadedPromise) {
        return sdkLoadedPromise;
    }

    sdkLoadedPromise = new Promise((resolve, reject) => {
        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js';
        appScript.async = true;
        appScript.onload = () => {
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore-compat.js';
            firestoreScript.async = true;
            firestoreScript.onload = () => resolve();
            firestoreScript.onerror = () => reject(new Error('Failed to load Firebase Firestore SDK script.'));
            document.head.appendChild(firestoreScript);
        };
        appScript.onerror = () => reject(new Error('Failed to load Firebase App SDK script.'));
        document.head.appendChild(appScript);
    });

    return sdkLoadedPromise;
};


// --- Firestore Initialization ---
// We use a promise to ensure that we only attempt to initialize once.
let firestorePromise: Promise<any> | null = null;

const initializeFirebase = async (): Promise<any> => {
    try {
        // First, ensure the SDK scripts are loaded.
        await loadFirebaseSDK();
        
        const firebase = (window as any).firebase;

        if (!firebase || typeof firebase.firestore !== 'function') {
            throw new Error('Firebase SDK is loaded but firestore is not available.');
        }

        // Initialize the app only if it hasn't been already.
        if (!firebase.apps.length) {
            // Provide a clear error message if the user forgets to add their config.
            if (firebaseConfig.apiKey.startsWith("PASTE_YOUR_")) {
                throw new Error("Firebase configuration is missing. Please follow the setup steps and add your project keys to firebase.ts.");
            }
            firebase.initializeApp(firebaseConfig);
        }

        return firebase.firestore();
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Re-throw the error to be caught by the API service.
        throw error;
    }
};

// This is the exported function that the rest of the app will use.
// It ensures that initializeFirebase is only ever called once.
export const getFirestore = (): Promise<any> => {
  if (!firestorePromise) {
    firestorePromise = initializeFirebase();
  }
  return firestorePromise;
};
