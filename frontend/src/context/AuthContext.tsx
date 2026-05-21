import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  quickSwitch: (targetUser: User, targetToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Đọc thông tin đăng nhập từ localStorage khi reload trang
    const storedToken = localStorage.getItem('crm_token');
    const storedUser = localStorage.getItem('crm_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('crm_token', newToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };

  // Switcher nhanh giữa các accounts để test realtime tag/chat
  const quickSwitch = (targetUser: User, targetToken: string) => {
    login(targetToken, targetUser);
    window.location.reload(); // Reload lại để kích hoạt kết nối Socket mới với userId tương ứng
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, quickSwitch }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};
