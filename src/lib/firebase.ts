import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdxUBheG5oQb6-XgCas-c3ZDBOsvTBhhY",
  authDomain: "rotaract-ead01.firebaseapp.com",
  projectId: "rotaract-ead01",
  storageBucket: "rotaract-ead01.firebasestorage.app",
  messagingSenderId: "1044998606852",
  appId: "1:1044998606852:web:96cec1ba2247a0c8956551",
  measurementId: "G-GNW5WCF8QE"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice: Please check your network and Firebase configuration.');
    }
  }
}

testConnection();