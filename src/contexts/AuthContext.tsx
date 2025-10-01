import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AdminUser, storage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  login: (user: User) => void;
  loginAdmin: (admin: AdminUser) => void;
  logout: () => void;
  logoutAdmin: () => void;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedUser = storage.getUser();
    const storedAdmin = storage.getAdminUser();
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedAdmin) {
      setAdminUser(storedAdmin);
    }
  }, []);

  const login = (userData: User) => {
    storage.setUser(userData);
    setUser(userData);
  };

  const loginAdmin = (adminData: AdminUser) => {
    storage.setAdminUser(adminData);
    setAdminUser(adminData);
  };

  const logout = () => {
    storage.clearUser();
    setUser(null);
  };

  const logoutAdmin = () => {
    storage.clearAdminUser();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      adminUser,
      login, 
      loginAdmin,
      logout, 
      logoutAdmin,
      isAuthenticated: !!user,
      isAdminAuthenticated: !!adminUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
