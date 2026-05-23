import React from 'react';
import PassportApp from './passport/PassportApp';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  }

  if (!currentUser) {
    return <div style={{ color: 'white', padding: '20px' }}>No user found</div>;
  }

  return <PassportApp />;
}

export default App;
