import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getErrorMessage = (error: AuthError): string => {
  console.error('Firebase Auth Error:', {
    code: error.code,
    message: error.message,
    customData: error.customData
  });

  switch (error.code) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cette adresse email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.';
    case 'auth/network-request-failed':
      return 'Erreur de connexion. Vérifiez votre connexion internet.';
    case 'auth/invalid-credential':
      return 'Identifiants invalides. Vérifiez votre email et mot de passe.';
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible. Utilisez au moins 6 caractères.';
    case 'auth/operation-not-allowed':
      return 'Création de compte temporairement désactivée.';
    case 'auth/api-key-not-valid':
      return 'Configuration Firebase invalide. Vérifiez la clé API.';
    case 'auth/invalid-api-key':
      return 'Clé API Firebase invalide.';
    default:
      return `Erreur d'authentification: ${error.message}`;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion pour:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Connexion réussie:', result.user.email);
    } catch (error) {
      const authError = error as AuthError;
      const errorMessage = getErrorMessage(authError);
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Tentative de création de compte pour:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Création de compte réussie:', result.user.email);
    } catch (error) {
      const authError = error as AuthError;
      const errorMessage = getErrorMessage(authError);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw new Error('Erreur lors de la déconnexion.');
    }
  };

  useEffect(() => {
    console.log('Configuration du listener d\'authentification...');
    
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        console.log('État d\'authentification changé:', user?.email || 'Aucun utilisateur');
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur du listener d\'authentification:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};