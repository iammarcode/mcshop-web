export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 