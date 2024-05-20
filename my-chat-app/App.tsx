import React from 'react';
import './App.css';
import MainPage from './pages/Main/MainPage';
import AdminPage from './pages/Admin/AdminPage';
import StudentPage from './pages/Student/StudentPage';
import AuthPage from './pages/Auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Auth/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/student" element={<StudentPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;