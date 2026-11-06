import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../firebase';
import { Supervisor, SupervisorPermissions } from '../types';

export const SUPER_ADMIN_EMAIL = "onlak2030@gmail.com";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  supervisorProfile: Supervisor | null;
  hasPermission: (permission: keyof SupervisorPermissions) => boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultPermissions: SupervisorPermissions = {
  broadcasts: true,
  lectures: true,
  interviews: true,
  quizzes: true,
  events: true,
  registrations: true,
  settings: false,
  supervisors: false
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isSuperAdmin: false,
  isAdmin: false,
  supervisorProfile: null,
  hasPermission: () => false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [supervisorProfile, setSupervisorProfile] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Check if supervisor record exists in Firestore
          const supRef = doc(db, 'supervisors', user.uid);
          const supSnap = await getDoc(supRef);
          
          if (supSnap.exists()) {
            setSupervisorProfile({ id: supSnap.id, ...supSnap.data() } as Supervisor);
          } else if (user.email === SUPER_ADMIN_EMAIL) {
            // Super Admin gets universal privileges
            setSupervisorProfile({
              id: user.uid,
              email: user.email,
              name: user.displayName || 'المدير العام',
              role: 'admin',
              permissions: {
                broadcasts: true,
                lectures: true,
                interviews: true,
                quizzes: true,
                events: true,
                registrations: true,
                settings: true,
                supervisors: true,
              },
              createdAt: new Date().toISOString()
            });
          } else {
            setSupervisorProfile(null);
          }
        } catch (error) {
          console.warn('Could not load supervisor profile:', error);
          setSupervisorProfile(null);
        }
      } else {
        setSupervisorProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || supervisorProfile?.role === 'admin';

  const hasPermission = (permission: keyof SupervisorPermissions): boolean => {
    if (isSuperAdmin || isAdmin) return true;
    if (!supervisorProfile) return false;
    return Boolean(supervisorProfile.permissions?.[permission]);
  };

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isSuperAdmin,
        isAdmin,
        supervisorProfile,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
