import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const login = (email: string, password: string) => {
    const user = users.find(user => user.email === email && user.password === password);
    const isLoggedIn = Boolean(user);
    setIsAuthenticated(isLoggedIn);
    return isLoggedIn;
  };

  const register = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, users, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};