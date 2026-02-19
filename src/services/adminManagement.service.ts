import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface CreateAdminRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  location?: string;
  userType: 'Admin' | 'Teacher';
}

export interface UpdateAdminRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  password?: string;
  isActive?: boolean;
}

export interface AdminResponse {
  userId: string;
  fullName: string;
  email: string;
  userType: string;
  phoneNumber?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  createdByRole: string;
}

export interface AdminListResponse {
  admins: AdminResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminStatsResponse {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  totalTeachers: number;
  activeTeachers: number;
  totalUsers: number;
  newAdminsThisMonth: number;
  newTeachersThisMonth: number;
}

export interface AdminFilterRequest {
  searchQuery?: string;
  status?: 'active' | 'inactive';
  userType?: 'Admin' | 'Teacher';
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class AdminManagementService {
  async getAllAdmins(filter: AdminFilterRequest = {}): Promise<ApiResponse<AdminListResponse>> {
    const params = new URLSearchParams();
    
    if (filter.searchQuery) params.append('searchQuery', filter.searchQuery);
    if (filter.status) params.append('status', filter.status);
    if (filter.userType) params.append('userType', filter.userType);
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}?${queryString}`
      : API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT;

    return apiService.get<ApiResponse<AdminListResponse>>(endpoint);
  }

  async getAdminById(userId: string): Promise<ApiResponse<AdminResponse>> {
    return apiService.get<ApiResponse<AdminResponse>>(
      `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}/${userId}`
    );
  }

  async createAdmin(data: CreateAdminRequest): Promise<ApiResponse<AdminResponse>> {
    return apiService.post<ApiResponse<AdminResponse>>(
      API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT,
      data
    );
  }

  async updateAdmin(userId: string, data: UpdateAdminRequest): Promise<ApiResponse<AdminResponse>> {
    return apiService.put<ApiResponse<AdminResponse>>(
      `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}/${userId}`,
      data
    );
  }

  async deleteAdmin(userId: string): Promise<ApiResponse<boolean>> {
    return apiService.delete<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}/${userId}`
    );
  }

  async toggleAdminStatus(userId: string): Promise<ApiResponse<boolean>> {
    return apiService.patch<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}/${userId}/toggle-status`
    );
  }

  async getAdminStats(): Promise<ApiResponse<AdminStatsResponse>> {
    return apiService.get<ApiResponse<AdminStatsResponse>>(
      `${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ADMIN_MANAGEMENT}/stats`
    );
  }
}

export const adminManagementService = new AdminManagementService();