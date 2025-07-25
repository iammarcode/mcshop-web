import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, UserProfile } from '../types';
import { login, register, getUserProfile, logout as apiLogout, isAuthenticated } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserProfile; accessToken: string; refreshToken: string } }
  | { type: 'AUTH_FAIL' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      if (!isAuthenticated()) {
        dispatch({ type: 'AUTH_FAIL' });
        return;
      }

      const user = await getUserProfile();
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (user && accessToken && refreshToken) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, accessToken, refreshToken }
        });
      } else {
        dispatch({ type: 'AUTH_FAIL' });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      dispatch({ type: 'AUTH_FAIL' });
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const authData = await login({ email, password });
      const user = await getUserProfile();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken: authData.accessToken, refreshToken: authData.refreshToken }
      });
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'AUTH_FAIL' });
      throw error;
    }
  };

  const registerUser = async (userData: any) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const authData = await register(userData);
      const user = await getUserProfile();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken: authData.accessToken, refreshToken: authData.refreshToken }
      });
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'AUTH_FAIL' });
      throw error;
    }
  };

  const logoutUser = () => {
    apiLogout();
    dispatch({ type: 'LOGOUT' });
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const value: AuthContextType = {
    ...state,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 