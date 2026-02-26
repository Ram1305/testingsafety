// src/services/course.service.ts
import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Types
export interface CourseListItem {
  courseId: string;
  courseCode: string;
  courseName: string;
  categoryId?: string;
  categoryName?: string;
  duration?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  hasTheory: boolean;
  hasPractical: boolean;
  hasExam: boolean;
  validityPeriod?: string;
  description?: string;
  enrolledStudentsCount: number;
  isActive: boolean;
  hasComboOffer: boolean;
  createdAt: string;
  courseDates?: string[];
  // Experience-based pricing
  experienceBookingEnabled: boolean;
  experiencePrice?: number;
  experienceOriginalPrice?: number;
  noExperiencePrice?: number;
  noExperienceOriginalPrice?: number;
}

export interface CoursePathways {
  description?: string;
  certifications: string[];
}

export interface CourseResourcePdf {
  title?: string;
  url?: string;
}

export interface CourseComboOffer {
  description: string;
  price: number;
  duration?: string;
}

export interface CourseDetail extends CourseListItem {
  deliveryMethod?: string;
  location?: string;
  courseDescription?: string;
  updatedAt?: string;
  entryRequirements: string[];
  trainingOverview: string[];
  vocationalOutcome: string[];
  pathways?: CoursePathways;
  feesAndCharges: string[];
  optionalCharges: string[];
  resourcePdf?: CourseResourcePdf;
  comboOffer?: CourseComboOffer;
  courseDates?: string[];
}

export interface CourseListResponse {
  courses: CourseListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CourseFilter {
  searchQuery?: string;
  categoryId?: string;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  hasComboOffer?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CreateCourseRequest {
  courseCode?: string;
  courseName?: string;
  categoryId?: string;
  duration?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  hasTheory?: boolean;
  hasPractical?: boolean;
  hasExam?: boolean;
  validityPeriod?: string;
  deliveryMethod?: string;
  location?: string;
  courseDescription?: string;
  entryRequirements?: string[];
  trainingOverview?: string[];
  vocationalOutcome?: string[];
  pathwaysDescription?: string;
  pathwaysCertifications?: string[];
  feesAndCharges?: string[];
  courseDates?: string[];
  optionalCharges?: string[];
  resourcePdfTitle?: string;
  resourcePdfUrl?: string;
  // Experience-based pricing
  experienceBookingEnabled?: boolean;
  experiencePrice?: number;
  experienceOriginalPrice?: number;
  noExperiencePrice?: number;
  noExperienceOriginalPrice?: number;
  comboOfferEnabled?: boolean;
  comboDescription?: string;
  comboPrice?: number;
  comboDuration?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isActive?: boolean;
}

export interface CategoryStats {
  categoryId: string;
  category: string;
  courseCount: number;
  enrollmentCount: number;
  revenue: number;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  coursesWithComboOffers: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageCoursePrice: number;
  totalCategories: number;
  categoryStats: CategoryStats[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class CourseService {
  // Get all courses with filtering
  async getAllCourses(filter?: CourseFilter): Promise<ApiResponse<CourseListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.COURSE.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.COURSE.BASE;
    return apiService.get<ApiResponse<CourseListResponse>>(endpoint);
  }

  // Get active courses only (for landing page)
  async getActiveCourses(filter?: CourseFilter): Promise<ApiResponse<CourseListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.COURSE.ACTIVE}?${queryString}`
      : API_CONFIG.ENDPOINTS.COURSE.ACTIVE;
    return apiService.get<ApiResponse<CourseListResponse>>(endpoint);
  }

  // Get featured courses
  async getFeaturedCourses(count: number = 6): Promise<ApiResponse<CourseListItem[]>> {
    return apiService.get<ApiResponse<CourseListItem[]>>(
      `${API_CONFIG.ENDPOINTS.COURSE.FEATURED}?count=${count}`
    );
  }

  // Get course by ID
  async getCourseById(courseId: string): Promise<ApiResponse<CourseDetail>> {
    return apiService.get<ApiResponse<CourseDetail>>(
      API_CONFIG.ENDPOINTS.COURSE.BY_ID(courseId)
    );
  }

  // Get course by code
  async getCourseByCode(courseCode: string): Promise<ApiResponse<CourseDetail>> {
    return apiService.get<ApiResponse<CourseDetail>>(
      API_CONFIG.ENDPOINTS.COURSE.BY_CODE(courseCode)
    );
  }

  // Create a new course
  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<CourseDetail>> {
    return apiService.post<ApiResponse<CourseDetail>>(
      API_CONFIG.ENDPOINTS.COURSE.BASE,
      data
    );
  }

  // Update a course
  async updateCourse(courseId: string, data: UpdateCourseRequest): Promise<ApiResponse<CourseDetail>> {
    return apiService.put<ApiResponse<CourseDetail>>(
      API_CONFIG.ENDPOINTS.COURSE.BY_ID(courseId),
      data
    );
  }

  // Delete a course
  async deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE.BY_ID(courseId)
    );
  }

  // Toggle course status
  async toggleCourseStatus(courseId: string): Promise<ApiResponse<null>> {
    return apiService.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE.TOGGLE_STATUS(courseId),
      {}
    );
  }

  // Get course statistics
  async getCourseStats(): Promise<ApiResponse<CourseStats>> {
    return apiService.get<ApiResponse<CourseStats>>(
      API_CONFIG.ENDPOINTS.COURSE.STATS
    );
  }

  // Check if course code exists
  async checkCourseCode(
    courseCode: string,
    excludeCourseId?: string
  ): Promise<ApiResponse<{ exists: boolean }>> {
    const params = excludeCourseId ? `?excludeCourseId=${excludeCourseId}` : '';
    return apiService.get<ApiResponse<{ exists: boolean }>>(
      `${API_CONFIG.ENDPOINTS.COURSE.CHECK_CODE(courseCode)}${params}`
    );
  }
}

export const courseService = new CourseService();