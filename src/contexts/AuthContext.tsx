import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authApi } from '@/services/api';
import type { AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.register(email, password, name);
      
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authApi.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
