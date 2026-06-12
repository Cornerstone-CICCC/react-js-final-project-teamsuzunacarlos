// Authentication context
// Should provide:
// - Current user state
// - Login/logout/signup functions
// - Auth state globally to app
// - Token management
// - Protected route logic

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "../types/index";
import { authService } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  register: (userData: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    authService
      .getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    const data = await authService.login(credentials);
    setUser(data.user);
  };

  const register = async (userData: Record<string, unknown>) => {
    const data = await authService.register(userData);
    setUser(data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
