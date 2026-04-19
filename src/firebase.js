import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app, db, analytics;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (e) {
  console.warn("Firebase initialization skipped or failed:", e);
}

export async function getSessions(userId) {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'sessions'), 
      where('userId', '==', userId), 
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firebase getSessions failed:", err);
    return [];
  }
}

export async function saveSession(sessionData) {
  try {
    if (!db) return;
    await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      timestamp: serverTimestamp(),
      sessionId: crypto.randomUUID()
    });
  } catch (err) {
    console.warn("Firebase saveSession failed silently:", err);
  }
}

export async function clearHistory(userId) {
  if (!db) return;
  try {
    const sessions = await getSessions(userId);
    const deletePromises = sessions.map(s => deleteDoc(doc(db, 'sessions', s.id)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn("Firebase clearHistory failed:", err);
  }
}

export function trackEvent(eventName, params) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (err) {
    console.warn("Firebase trackEvent failed silently:", err);
  }
}
