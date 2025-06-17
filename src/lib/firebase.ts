import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAS0klm5kJll89IwqdFYbfMzQVQjQugctg",
  authDomain: "minibizz-12974.firebaseapp.com",
  projectId: "minibizz-12974",
  storageBucket: "minibizz-12974.firebasestorage.app",
  messagingSenderId: "645556858596",
  appId: "1:645556858596:web:fbf1a40e076344ce7846f1",
  measurementId: "G-PXZ4HZCZ3B"
};

// Validation de la configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error('Configuration Firebase incomplète');
}

console.log('Initialisation Firebase avec:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyPresent: !!firebaseConfig.apiKey
});

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configuration pour le développement
auth.useDeviceLanguage();

console.log('Firebase initialisé avec succès');

export default app;