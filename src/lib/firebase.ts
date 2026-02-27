import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD5rqAE5gJXW8D-oNxvmv8X3Qoek5QEUTc",
  authDomain: "frontend-aquaequipos.firebaseapp.com",
  projectId: "frontend-aquaequipos",
  storageBucket: "frontend-aquaequipos.firebasestorage.app",
  messagingSenderId: "411256889270",
  appId: "1:411256889270:web:3e3aaf0be3b828d1646b17",
  measurementId: "G-WBL6KS9FTZ"
};

// Initialize Firebase solo si no está inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Analytics solo en el cliente
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, analytics };
