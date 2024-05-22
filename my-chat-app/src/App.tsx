import React from 'react';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import MainPage from './pages/Main/MainPage';
import ChatRoomPage from './pages/Chat/ChatRoomPage';
import ChatPage from './pages/Chat/ChatPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chat-room"
            element={
              <ProtectedRoute>
                <ChatRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-room/:roomId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;