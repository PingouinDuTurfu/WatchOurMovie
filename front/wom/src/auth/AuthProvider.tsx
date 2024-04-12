import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  function login(token: string, userId: string) {
    setAuthToken(token);
    setUserId(userId);
  };

  function logout() {
    setAuthToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
