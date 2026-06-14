import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, JwtPayload } from '../types';

// ── Context shape ────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Helpers ──────────────────────────────────────────
function decodeToken(token: string): User | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    // Reject expired tokens
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return { email: payload.sub, token };
  } catch {
    return null;
  }
}

// ── Provider ─────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    async function loadToken() {
      try {
        const stored = await AsyncStorage.getItem('token');
        if (stored) {
          const decoded = decodeToken(stored);
          if (decoded) {
            setUser(decoded);
          } else {
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, []);

  const login = useCallback(async (token: string) => {
    await AsyncStorage.setItem('token', token);
    const decoded = decodeToken(token);
    setUser(decoded);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
