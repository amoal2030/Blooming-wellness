import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../firebase';
import { Supervisor, SupervisorPermissions } from '../types';

export const SUPER_ADMIN_EMAILS = [
  "onlak2030@gmail.com",
  "amoal2030@gmail.com"
];
export const SUPER_ADMIN_EMAIL = "onlak2030@gmail.com";
export const SUPER_ADMIN_UID = "AzxlMQTMEQRZsJf3LCUbTjuwFus2";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAuthorizedStaff: boolean;
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
  isAuthorizedStaff: false,
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
          const userEmail = user.email?.trim().toLowerCase();
          const isUserSuperAdmin = 
            (userEmail && SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail)) ||
            user.uid === SUPER_ADMIN_UID;

          if (isUserSuperAdmin) {
            // Super Admin gets universal privileges
            setSupervisorProfile({
              id: user.uid,
              email: user.email || SUPER_ADMIN_EMAIL,
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
            // Check if user is registered in the supervisors collection
            // 1. Check by UID
            let supSnap = await getDoc(doc(db, 'supervisors', user.uid));
            
            // 2. Check by lowercase email
            if (!supSnap.exists() && userEmail) {
              supSnap = await getDoc(doc(db, 'supervisors', userEmail));
            }

            // 3. Check by sanitized email
            if (!supSnap.exists() && userEmail) {
              const sanitizedId = userEmail.replace(/[@.]/g, '_');
              supSnap = await getDoc(doc(db, 'supervisors', sanitizedId));
            }
            
            if (supSnap.exists()) {
              const data = supSnap.data() as Supervisor;
              // Only grant supervisor profile if role is authorized
              if (data.role === 'admin' || data.role === 'editor') {
                const { id: _, ...rest } = data;
                setSupervisorProfile({ id: supSnap.id, ...rest });
              } else {
                setSupervisorProfile(null);
              }
            } else {
              // Regular user: strictly null supervisor profile
              setSupervisorProfile(null);
            }
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

  const isSuperAdmin = Boolean(
    currentUser && (
      (currentUser.email && SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === currentUser.email?.trim().toLowerCase())) ||
      currentUser.uid === SUPER_ADMIN_UID
    )
  );

  const isAuthorizedSupervisor = Boolean(
    !isSuperAdmin &&
    supervisorProfile != null &&
    (supervisorProfile.role === 'admin' || supervisorProfile.role === 'editor')
  );

  // User is allowed into Admin Dashboard ONLY if they are Super Admin or an Authorized Supervisor
  const isAuthorizedStaff = Boolean(isSuperAdmin || isAuthorizedSupervisor);

  const isAdmin = isSuperAdmin || (supervisorProfile?.role === 'admin');

  const hasPermission = (permission: keyof SupervisorPermissions): boolean => {
    if (!isAuthorizedStaff) return false;
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
      setSupervisorProfile(null);
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
        isAuthorizedStaff,
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
