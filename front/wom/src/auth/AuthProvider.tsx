import { createContext, useContext, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthContextType {
  authToken: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('userId');
  });

  function login(token: string, userId: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    setAuthToken(token);
    setUserId(userId);
  };

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setAuthToken(null);
    setUserId(null);
    
    return <Navigate to="/" />;
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
