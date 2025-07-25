// API Response Types
export interface ApiResponse<T> {
  timestamp: string;
  code: number;
  data: T;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  otp: string;
}

export interface OtpRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessExpireAt: string;
  refreshExpireAt: string;
}

export interface RegisterResponse extends AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
}

// User Types
export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface CreateProfileRequest {
  userId: string;
  firstname: string;
  lastname: string;
  phone: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface ProductListResponse {
  records: Product[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// Inventory Types
export interface Inventory {
  productId: string;
  quantity: number;
  reservedQuantity: number;
}

// Order Types
export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface PlaceOrderRequest {
  products: OrderProduct[];
  userAddressId?: string;
  currency: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  orderId: string;
  message: string;
  paymentUrl: string;
}

// Error Types
export interface ApiError {
  timestamp: string;
  code: number;
  error: string;
  path?: string;
  traceId?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  size?: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// App State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
}

export interface AppState {
  auth: AuthState;
  cart: CartItem[];
} 