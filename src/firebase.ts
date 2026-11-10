import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  setLogLevel,
  doc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Set log level to silent to prevent noisy internal 10s watchdog logs in iframe and proxy environments
setLogLevel('silent');

// Initialize Firestore with the provisioned database ID as mandated by SKILL.md
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isOffline = 
    errorMessage.toLowerCase().includes('offline') || 
    (error as any)?.code === 'unavailable' ||
    errorMessage.toLowerCase().includes('client is offline');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  // Only emit diagnostic Firestore Error Details for rule/permission or unexpected failures, not offline disconnects
  if (!isOffline) {
    console.error('Firestore Error Details:', JSON.stringify(errInfo));
  } else {
    console.warn('[Firestore Offline / Network Notice]:', errorMessage);
  }
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot with timeout safeguard so it never blocks the app
export async function testConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('the client is offline')), 3000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
      return false;
    }
    return true;
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
try {
  auth.useDeviceLanguage();
} catch {
  // Ignored in non-browser runtimes
}

// Auth helpers
export async function loginWithGoogle() {
  try {
    console.info('[Firebase Auth] Initiating signInWithPopup for domain:', typeof window !== 'undefined' ? window.location.hostname : 'unknown');
    const result = await signInWithPopup(auth, googleProvider);
    console.info('[Firebase Auth] Success! Signed in user:', result.user.email);
    return result.user;
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || String(error);
    console.error(`[Firebase Auth Error] Code: ${errorCode} | Message: ${errorMessage}`, {
      code: errorCode,
      message: errorMessage,
      domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
      authDomain: firebaseConfig.authDomain,
      error
    });
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}
