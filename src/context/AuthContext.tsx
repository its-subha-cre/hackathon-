import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  sub: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  department: string;
  token?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (role: 'ADMIN' | 'USER', username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check saved session on initial mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('kfin_jwt_token') || localStorage.getItem('kfin_jwt_token');
    if (savedToken) {
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Periodic heartbeat: If backend is stopped (Ctrl+C) or returns 401, auto sign-out immediately
  useEffect(() => {
    if (!isAuthenticated || !user?.token) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) {
          logoutInternal();
        }
      } catch (err) {
        // Backend service stopped or unreachable -> automatic sign-out
        logoutInternal();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.token]);

  const fetchUserProfile = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const profile = await res.json();
        setUser({ ...profile, token });
        setIsAuthenticated(true);
      } else {
        logoutInternal();
      }
    } catch (e) {
      // Backend unreachable -> automatic sign-out
      logoutInternal();
    } finally {
      setLoading(false);
    }
  };

  const login = async (role: 'ADMIN' | 'USER', username: string, password: string) => {
    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role, username, password })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(errorData.detail || 'Invalid username or password for selected role.');
    }

    const data = await res.json();
    if (data.token) {
      sessionStorage.setItem('kfin_jwt_token', data.token);
      localStorage.setItem('kfin_jwt_token', data.token);
      setUser({ ...data.user, token: data.token });
      setIsAuthenticated(true);
    }
  };

  const logoutInternal = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('kfin_jwt_token');
    localStorage.removeItem('kfin_jwt_token');
    localStorage.removeItem('kfin_user');
  };

  const logout = async () => {
    const savedToken = sessionStorage.getItem('kfin_jwt_token') || localStorage.getItem('kfin_jwt_token');
    if (savedToken) {
      fetch('http://localhost:8000/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${savedToken}` }
      }).catch(() => {});
    }
    logoutInternal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
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
