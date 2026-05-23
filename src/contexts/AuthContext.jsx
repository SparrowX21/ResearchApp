import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { DEFAULT_STUDENT_DATA, INITIAL_RESEARCH_STATE } from './userDefaults';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const MOCK_STORAGE_KEY = 'edusuite_mock_user';

function saveLocalUser(user) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
}

function loadLocalUser() {
  const raw = localStorage.getItem(MOCK_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState({
    mode: 'local',
  });

  const persistLocal = useCallback((user) => {
    if (!user) return;
    saveLocalUser(user);
  }, []);

  useEffect(() => {
    const saved = loadLocalUser();
    if (saved) {
      setCurrentUser(saved);
    } else {
      const mockUser = {
        id: 'mock-student-123',
        email: 'demo.student@edusuite.ai',
        name: 'Demo Student',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EduSuite',
        studentData: DEFAULT_STUDENT_DATA,
        researchState: INITIAL_RESEARCH_STATE,
      };
      saveLocalUser(mockUser);
      setCurrentUser(mockUser);
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    const mockUser = {
      id: 'mock-student-123',
      email: 'demo.student@edusuite.ai',
      name: 'Demo Student',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EduSuite',
      studentData: DEFAULT_STUDENT_DATA,
      researchState: INITIAL_RESEARCH_STATE,
    };
    saveLocalUser(mockUser);
    setCurrentUser(mockUser);
    setCloudStatus({ mode: 'local' });
  };

  const logout = async () => {
    localStorage.removeItem(MOCK_STORAGE_KEY);
    setCurrentUser(null);
    setCloudStatus({ mode: 'local' });
  };

  const updateStudentData = async (updates) => {
    if (!currentUser) return;

    const updatedStudentData = { ...currentUser.studentData, ...updates };
    const updatedUser = { ...currentUser, studentData: updatedStudentData };

    setCurrentUser(updatedUser);
    persistLocal(updatedUser);
  };

  const updateResearchState = async (newState) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, researchState: newState };
    setCurrentUser(updatedUser);
    persistLocal(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        cloudStatus,
        isCloudFullyConfigured: false,
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
