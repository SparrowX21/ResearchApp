import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { isFirebaseConfigured, isSupabaseConfigured, isCloudFullyConfigured } from '../config/appConfig';
import { linkFirebaseToSupabase, signOutSupabase } from '../services/supabaseAuth';
import {
  fetchUserById,
  createUserProfile,
  updateStudentDataInCloud,
  updateResearchStateInCloud,
} from '../services/userCloud';
import { buildNewUserFromFirebase } from '../lib/userMapper';
import { DEFAULT_STUDENT_DATA, INITIAL_RESEARCH_STATE } from './userDefaults';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const MOCK_STORAGE_KEY = 'edusuite_mock_user';

function getLocalUserKey(email) {
  return `edusuite_user_${email}`;
}

function saveLocalUser(user) {
  if (!user?.email) return;
  localStorage.setItem(getLocalUserKey(user.email), JSON.stringify(user));
}

function loadLocalUser(email) {
  const raw = localStorage.getItem(getLocalUserKey(email));
  return raw ? JSON.parse(raw) : null;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState({
    firebase: isFirebaseConfigured,
    supabase: isSupabaseConfigured,
    linked: false,
    mode: 'local',
  });

  const persistLocal = useCallback((user) => {
    if (!user) return;
    if (!isFirebaseConfigured) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
    } else if (user.email) {
      saveLocalUser(user);
    }
  }, []);

  const hydrateUserFromCloud = useCallback(async (firebaseUser) => {
    const link = await linkFirebaseToSupabase(firebaseUser);
    const linked = link.ok;

    setCloudStatus({
      firebase: true,
      supabase: isSupabaseConfigured,
      linked,
      mode: linked && isSupabaseConfigured ? 'cloud' : 'local',
    });

    if (!isSupabaseConfigured) {
      const local = loadLocalUser(firebaseUser.email);
      const user =
        local ||
        buildNewUserFromFirebase(firebaseUser);
      persistLocal(user);
      setCurrentUser(user);
      return;
    }

    if (!linked) {
      console.warn(
        'Cloud database requires Firebase provider in Supabase. Using local backup. See docs/CLOUD_SETUP.md'
      );
      const local = loadLocalUser(firebaseUser.email);
      const user = local || buildNewUserFromFirebase(firebaseUser);
      persistLocal(user);
      setCurrentUser(user);
      return;
    }

    const { user: existing, error: fetchError } = await fetchUserById(firebaseUser.uid);

    if (existing) {
      persistLocal(existing);
      setCurrentUser(existing);
      return;
    }

    if (fetchError) {
      console.warn('Cloud fetch failed, using local backup:', fetchError.message || fetchError);
      const local = loadLocalUser(firebaseUser.email);
      const user = local || buildNewUserFromFirebase(firebaseUser);
      persistLocal(user);
      setCurrentUser(user);
      return;
    }

    const { user: created, error: createError } = await createUserProfile(firebaseUser);

    if (createError) {
      console.warn('Cloud profile create failed:', createError.message);
      const local = loadLocalUser(firebaseUser.email) || buildNewUserFromFirebase(firebaseUser);
      persistLocal(local);
      setCurrentUser(local);
      return;
    }

    persistLocal(created);
    setCurrentUser(created);
  }, [persistLocal]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const saved = localStorage.getItem(MOCK_STORAGE_KEY);
      if (saved) setCurrentUser(JSON.parse(saved));
      setCloudStatus({
        firebase: false,
        supabase: isSupabaseConfigured,
        linked: false,
        mode: 'local',
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await hydrateUserFromCloud(firebaseUser);
        } else {
          setCurrentUser(null);
          setCloudStatus({
            firebase: true,
            supabase: isSupabaseConfigured,
            linked: false,
            mode: 'local',
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [hydrateUserFromCloud]);

  const loginWithGoogle = async () => {
    if (!auth) {
      const saved = localStorage.getItem(MOCK_STORAGE_KEY);
      const mockUser = saved
        ? JSON.parse(saved)
        : {
            id: 'mock-student-123',
            email: 'demo.student@edusuite.ai',
            name: 'Demo Student',
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EduSuite',
            studentData: DEFAULT_STUDENT_DATA,
            researchState: INITIAL_RESEARCH_STATE,
          };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setCloudStatus({ firebase: false, supabase: false, linked: false, mode: 'local' });
      return;
    }

    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOutSupabase();
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
    localStorage.removeItem(MOCK_STORAGE_KEY);
    setCurrentUser(null);
    setCloudStatus({
      firebase: isFirebaseConfigured,
      supabase: isSupabaseConfigured,
      linked: false,
      mode: 'local',
    });
  };

  const updateStudentData = async (updates) => {
    if (!currentUser) return;

    const updatedStudentData = { ...currentUser.studentData, ...updates };
    const updatedUser = { ...currentUser, studentData: updatedStudentData };

    setCurrentUser(updatedUser);
    persistLocal(updatedUser);

    if (cloudStatus.mode === 'cloud' && isSupabaseConfigured) {
      const { error } = await updateStudentDataInCloud(currentUser.id, updatedStudentData);
      if (error) {
        console.error('Failed to sync profile to cloud:', error.message);
        throw error;
      }
    }
  };

  const updateResearchState = async (newState) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, researchState: newState };
    setCurrentUser(updatedUser);
    persistLocal(updatedUser);

    if (cloudStatus.mode === 'cloud' && isSupabaseConfigured) {
      const { error } = await updateResearchStateInCloud(currentUser.id, newState);
      if (error) {
        console.error('Failed to sync research state to cloud:', error.message);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        cloudStatus,
        isCloudFullyConfigured,
        loginWithGoogle,
        logout,
        updateStudentData,
        updateResearchState,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
