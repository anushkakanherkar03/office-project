import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, loginUser, signupUser } from '../services/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

function setCompatSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', user.email || '');
  localStorage.setItem('currentFarmer', JSON.stringify({ identifier: user.email || '' }));
}

function clearCompatSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('currentFarmer');
  localStorage.removeItem('farmer_password');
  localStorage.removeItem('farmer_name');
  localStorage.removeItem('farmer_mobile');
  localStorage.removeItem('farmer_email');
  localStorage.removeItem('farmer_village');
  localStorage.removeItem('farmer_district');
  localStorage.removeItem('farmer_state');
  localStorage.removeItem('farmer_land_size');
  localStorage.removeItem('past_crop');
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const result = await fetchProfile(token);
        if (!active) return;
        setUser(result.user);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      } catch {
        if (!active) return;
        setToken('');
        setUser(null);
        clearCompatSession();
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [token]);

  const authValue = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    async login(credentials) {
      const result = await loginUser(credentials);
      setToken(result.token);
      setUser(result.user);
      setCompatSession(result.token, result.user);
      return result;
    },
    async signup(credentials) {
      return signupUser(credentials);
    },
    logout() {
      setToken('');
      setUser(null);
      clearCompatSession();
    },
  }), [token, user, loading]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}