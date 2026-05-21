import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
