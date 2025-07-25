import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  UserProfile,
  CreateProfileRequest,
  Product,
  ProductListResponse,
  Inventory,
  PlaceOrderRequest,
  PlaceOrderResponse,
  PaginationParams,
  ApiError
} from '../types';

// Extend axios config to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userId && config.headers) {
      config.headers['X-User-Id'] = userId;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/refresh', {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Helper function to handle API errors
const handleApiError = (error: AxiosError<ApiError>): never => {
  if (error.response?.data) {
    throw new Error(error.response.data.error || 'An error occurred');
  }
  throw new Error(error.message || 'Network error');
};

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const requestOtp = async (email: string): Promise<void> => {
  try {
    await api.request<ApiResponse<null>>({
      method: 'GET',
      url: '/api/v1/auth/otp',
      params: { email }
    });
  } catch (error) {
    handleApiError(error as AxiosError<ApiError>);
  }
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', credentials);
    const authData = handleApiResponse(response);
    
    // Store tokens
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    
    return authData;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post<ApiResponse<RegisterResponse>>('/api/v1/auth/register', userData);
    const authData = handleApiResponse(response);
    
    // Store tokens and user info
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('userId', authData.user.id);
    
    return authData;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/refresh', { refreshToken });
    const authData = handleApiResponse(response);
    
    // Update stored tokens
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    
    return authData;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// ============================================================================
// USER SERVICE
// ============================================================================

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<ApiResponse<UserProfile>>('/api/v1/user/profile/me');
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

export const createUserProfile = async (profileData: CreateProfileRequest): Promise<UserProfile> => {
  try {
    const response = await api.post<UserProfile>('/api/v1/user/profile', profileData);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const getAllProducts = async (params?: PaginationParams): Promise<ProductListResponse> => {
  try {
    const response = await api.get<ApiResponse<ProductListResponse>>('/api/v1/product/all', {
      params
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<ApiResponse<Product>>(`/api/v1/product/${id}`);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// ============================================================================
// INVENTORY SERVICE
// ============================================================================

export const getInventory = async (productId: string): Promise<Inventory> => {
  try {
    const response = await api.get<Inventory>(`/api/v1/product/inventory/${productId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// ============================================================================
// ORDER SERVICE
// ============================================================================

export const placeOrder = async (orderData: PlaceOrderRequest): Promise<PlaceOrderResponse> => {
  try {
    const response = await api.post<ApiResponse<PlaceOrderResponse>>('/api/v1/order/place', orderData);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export default api; 