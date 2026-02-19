import { apiService } from './api.service';

// Types for the public enrollment wizard flow
export interface CourseDropdownItem {
  courseId: string;
  courseCode: string;
  courseName: string;
  price: number;
  duration?: string;
  categoryName?: string;
}

export interface CourseDateDropdownItem {
  courseDateId: string;
  startDate: string;
  endDate: string;
  location?: string;
  availableSlots: number;
  maxCapacity: number;
  isAvailable: boolean;
}

export interface PublicRegistrationRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface PublicRegistrationResponse {
  userId: string;
  studentId: string;
  email: string;
  fullName: string;
  token: string;
}

export interface CourseEnrollmentRequest {
  studentId: string;
  courseId: string;
  courseDateId: string;
  paymentMethod: string; // 'online' | 'cash' | 'bank_transfer'
}

export interface CourseEnrollmentResponse {
  enrollmentId: string;
  courseId: string;
  courseDateId: string;
  status: string;
}

export interface EnrollmentLinkRequest {
  name: string;
  description?: string;
  courseId?: string; // Optional - if set, pre-selects the course
  courseDateId?: string; // Optional - if set, pre-selects the date
  expiresAt?: string;
  maxUses?: number;
}

export interface EnrollmentLinkResponse {
  linkId: string;
  name: string;
  description?: string;
  courseId?: string;
  courseName?: string;
  courseDateId?: string;
  courseDateRange?: string;
  uniqueCode: string;
  fullUrl: string;
  qrCodeDataUrl: string;
  createdAt: string;
  expiresAt?: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
}

export interface EnrollmentLinkListResponse {
  links: EnrollmentLinkResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Public Enrollment Wizard Service
export const publicEnrollmentWizardService = {
  // Get all active courses for dropdown
  async getCoursesForDropdown(): Promise<ApiResponse<CourseDropdownItem[]>> {
    return apiService.get<ApiResponse<CourseDropdownItem[]>>('/PublicEnrollment/courses');
  },

  // Get available dates for a specific course
  async getCourseDates(courseId: string): Promise<ApiResponse<CourseDateDropdownItem[]>> {
    return apiService.get<ApiResponse<CourseDateDropdownItem[]>>(`/PublicEnrollment/courses/${courseId}/dates`);
  },

  // Step 1: Register user (creates User + Student)
  async registerUser(request: PublicRegistrationRequest): Promise<ApiResponse<PublicRegistrationResponse>> {
    return apiService.post<ApiResponse<PublicRegistrationResponse>>('/PublicEnrollment/register', request);
  },

  // Step 2: Enroll in course with selected date
  async enrollInCourse(request: CourseEnrollmentRequest): Promise<ApiResponse<CourseEnrollmentResponse>> {
    return apiService.post<ApiResponse<CourseEnrollmentResponse>>('/PublicEnrollment/enroll', request);
  },

  // Get enrollment wizard data by link code
  async getWizardDataByCode(code: string): Promise<ApiResponse<{
    linkId: string;
    courseId?: string;
    courseName?: string;
    courseDateId?: string;
    courseDateRange?: string;
  }>> {
    return apiService.get<ApiResponse<{
      linkId: string;
      courseId?: string;
      courseName?: string;
      courseDateId?: string;
      courseDateRange?: string;
    }>>(`/PublicEnrollment/link/${code}`);
  },

  // Admin: Create enrollment link
  async createEnrollmentLink(request: EnrollmentLinkRequest): Promise<ApiResponse<EnrollmentLinkResponse>> {
    return apiService.post<ApiResponse<EnrollmentLinkResponse>>('/PublicEnrollment/admin/links', request);
  },

  // Admin: Get all enrollment links
  async getEnrollmentLinks(page: number = 1, pageSize: number = 10): Promise<ApiResponse<EnrollmentLinkListResponse>> {
    return apiService.get<ApiResponse<EnrollmentLinkListResponse>>(`/PublicEnrollment/admin/links?page=${page}&pageSize=${pageSize}`);
  },

  // Admin: Get single enrollment link
  async getEnrollmentLink(linkId: string): Promise<ApiResponse<EnrollmentLinkResponse>> {
    return apiService.get<ApiResponse<EnrollmentLinkResponse>>(`/PublicEnrollment/admin/links/${linkId}`);
  },

  // Admin: Toggle link status
  async toggleLinkStatus(linkId: string): Promise<ApiResponse<null>> {
    return apiService.patch<ApiResponse<null>>(`/PublicEnrollment/admin/links/${linkId}/toggle`, {});
  },

  // Admin: Delete link
  async deleteEnrollmentLink(linkId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(`/PublicEnrollment/admin/links/${linkId}`);
  },

  // Admin: Regenerate QR code
  async regenerateQRCode(linkId: string): Promise<ApiResponse<{ qrCodeDataUrl: string }>> {
    return apiService.post<ApiResponse<{ qrCodeDataUrl: string }>>(`/PublicEnrollment/admin/links/${linkId}/regenerate-qr`, {});
  },
};
