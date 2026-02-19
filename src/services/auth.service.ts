import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  userType: string;
  phoneNumber?: string;
  lastLoginAt?: string;
  isActive: boolean;
  studentId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
  }

  async checkEmail(email: string): Promise<ApiResponse<boolean>> {
    return apiService.get<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.AUTH.CHECK_EMAIL}/${email}`
    );
  }

  async getUserById(userId: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.get<ApiResponse<AuthResponse>>(
      `${API_CONFIG.ENDPOINTS.AUTH.GET_USER}/${userId}`
    );
  }
}

export const authService = new AuthService();