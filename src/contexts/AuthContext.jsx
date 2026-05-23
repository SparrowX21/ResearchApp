import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const INITIAL_RESEARCH_STATE = {
  currentStage: 0,
  completedStages: [],
  topic: '',
  researchQuestion: '',
  thesis: '',
  thesisScores: { clarity: 0, arguability: 0, specificity: 0, sophistication: 0, feedback: '' },
  researchPlan: null,
  sources: [],
  outline: [],
  draft: '',
  revisionFeedback: null,
};

const DEFAULT_STUDENT_DATA = {
  name: 'Demo Student',
  grade: '11th Grade',
  school: 'Academic Prep High',
  gpa: '4.00',
  targetMajor: 'Computer Science & AI',
  bio: 'Passionate student interested in machine learning ethics, independent research, and high school computer science pathways.',
  skills: [
    { id: 1, name: 'Python Programming', category: 'Technical', proficiency: 'Advanced' },
    { id: 2, name: 'Academic Research Methods', category: 'Research', proficiency: 'Intermediate' }
  ],
  courses: [
    { id: 1, name: 'AP Computer Science A', grade: 'A', type: 'AP' },
    { id: 2, name: 'Honors Pre-Calculus', grade: 'A', type: 'Honors' }
  ],
  projects: [],
  competitions: 0,
  extracurriculars: [],
  volunteerLogs: [],
  completedMilestones: [],
  colleges: [],
  interests: ['technology'],
  documents: []
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If Firebase Auth is not configured, load persistent mock user
    if (!auth) {
      const savedMockUser = localStorage.getItem('edusuite_mock_user');
      if (savedMockUser) {
        setCurrentUser(JSON.parse(savedMockUser));
      }
      setLoading(false);
      return;
    }

    // 2. Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserWithSupabase(firebaseUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const syncUserWithSupabase = async (firebaseUser) => {
    try {
      if (!supabase) {
        throw new Error("Supabase unconfigured");
      }

      const { data: userRecord, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', firebaseUser.uid)
        .single();

      if (userRecord) {
        setCurrentUser(userRecord);
      } else {
        // Create new user record
        const newUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Student',
          picture: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          studentData: {
            ...DEFAULT_STUDENT_DATA,
            name: firebaseUser.displayName || 'Student',
          },
          researchState: INITIAL_RESEARCH_STATE
        };

        const { data: createdUser, error: insertError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (insertError) throw insertError;
        setCurrentUser(createdUser);
      }
    } catch (e) {
      console.warn('Supabase sync bypassed. Running in Simulated Local Mode:', e.message);
      
      // Load or create persistent mock profile linked to this email
      const localKey = `edusuite_user_${firebaseUser.email}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        const mockUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Student',
          picture: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          studentData: {
            ...DEFAULT_STUDENT_DATA,
            name: firebaseUser.displayName || 'Student',
          },
          researchState: INITIAL_RESEARCH_STATE
        };
        localStorage.setItem(localKey, JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!auth) {
        throw new Error("auth/invalid-api-key");
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.warn('Bypassing Google Sign In to Local Simulated session:', error.message);
      
      // Load last mock session or initialize default
      const savedMockUser = localStorage.getItem('edusuite_mock_user');
      if (savedMockUser) {
        setCurrentUser(JSON.parse(savedMockUser));
      } else {
        const mockUser = {
          id: 'mock-student-123',
          email: 'demo.student@edusuite.ai',
          name: 'Demo Student (Mock)',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EduSuite',
          studentData: DEFAULT_STUDENT_DATA,
          researchState: INITIAL_RESEARCH_STATE
        };
        localStorage.setItem('edusuite_mock_user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      }
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
    // Clean up local mock sessions too
    localStorage.removeItem('edusuite_mock_user');
    setCurrentUser(null);
  };

  const updateStudentData = async (updates) => {
    if (!currentUser) return;
    const updatedStudentData = { ...currentUser.studentData, ...updates };
    const updatedUser = { ...currentUser, studentData: updatedStudentData };
    
    setCurrentUser(updatedUser);

    // Save to localStorage for persistent mock testing
    if (!auth) {
      localStorage.setItem('edusuite_mock_user', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem(`edusuite_user_${currentUser.email}`, JSON.stringify(updatedUser));
    }

    try {
      if (!supabase) return;
      await supabase
        .from('users')
        .update({ studentData: updatedStudentData })
        .eq('id', currentUser.id);
    } catch (error) {
      console.error('Failed to update studentData in Supabase:', error);
    }
  };

  const updateResearchState = async (newState) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, researchState: newState };
    
    setCurrentUser(updatedUser);

    // Save to localStorage for persistent mock testing
    if (!auth) {
      localStorage.setItem('edusuite_mock_user', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem(`edusuite_user_${currentUser.email}`, JSON.stringify(updatedUser));
    }

    try {
      if (!supabase) return;
      await supabase
        .from('users')
        .update({ researchState: newState })
        .eq('id', currentUser.id);
    } catch (error) {
      console.error('Failed to update researchState in Supabase:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginWithGoogle, logout, updateStudentData, updateResearchState }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
