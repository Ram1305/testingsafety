// src/services/category.service.ts
import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Types
export interface CategoryItem {
  categoryId: string;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  courseCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryDropdownItem {
  categoryId: string;
  categoryName: string;
}

export interface CategoryListResponse {
  categories: CategoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryDropdownResponse {
  categories: CategoryDropdownItem[];
}

export interface CategoryFilter {
  searchQuery?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CreateCategoryRequest {
  categoryName: string;
  description?: string;
  iconUrl?: string;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  categoryName?: string;
  description?: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class CategoryService {
  // Get all categories with filtering
  async getAllCategories(filter?: CategoryFilter): Promise<ApiResponse<CategoryListResponse>> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.CATEGORY.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.CATEGORY.BASE;
    return apiService.get<ApiResponse<CategoryListResponse>>(endpoint);
  }

  // Get categories for dropdown (active only)
  async getCategoriesDropdown(): Promise<ApiResponse<CategoryDropdownResponse>> {
    return apiService.get<ApiResponse<CategoryDropdownResponse>>(
      API_CONFIG.ENDPOINTS.CATEGORY.DROPDOWN
    );
  }

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<ApiResponse<CategoryItem>> {
    return apiService.get<ApiResponse<CategoryItem>>(
      API_CONFIG.ENDPOINTS.CATEGORY.BY_ID(categoryId)
    );
  }

  // Create a new category
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<CategoryItem>> {
    return apiService.post<ApiResponse<CategoryItem>>(
      API_CONFIG.ENDPOINTS.CATEGORY.BASE,
      data
    );
  }

  // Update a category
  async updateCategory(categoryId: string, data: UpdateCategoryRequest): Promise<ApiResponse<CategoryItem>> {
    return apiService.put<ApiResponse<CategoryItem>>(
      API_CONFIG.ENDPOINTS.CATEGORY.BY_ID(categoryId),
      data
    );
  }

  // Delete a category
  async deleteCategory(categoryId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.CATEGORY.BY_ID(categoryId)
    );
  }

  // Toggle category status
  async toggleCategoryStatus(categoryId: string): Promise<ApiResponse<null>> {
    return apiService.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.CATEGORY.TOGGLE_STATUS(categoryId),
      {}
    );
  }

  // Reorder categories
  async reorderCategories(categoryIds: string[]): Promise<ApiResponse<null>> {
    return apiService.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.CATEGORY.REORDER,
      categoryIds
    );
  }

  // Check if category name exists
  async checkCategoryName(
    categoryName: string,
    excludeCategoryId?: string
  ): Promise<ApiResponse<{ exists: boolean }>> {
    const params = excludeCategoryId ? `?excludeCategoryId=${excludeCategoryId}` : '';
    return apiService.get<ApiResponse<{ exists: boolean }>>(
      `${API_CONFIG.ENDPOINTS.CATEGORY.CHECK_NAME(categoryName)}${params}`
    );
  }
}

export const categoryService = new CategoryService();