import React from 'react';
import PassportApp from './passport/PassportApp';
import HomePage from './components/HomePage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <HomePage />;
  }

  return <PassportApp />;
}

export default App;
