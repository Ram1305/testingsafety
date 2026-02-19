import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface CourseDateItem {
  courseDateId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  dateType: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  currentEnrollments: number;
  availableSpots: number;
  isActive: boolean;
  createdAt: string;
  // Teacher information
  teacherId?: string;
  teacherName?: string;
  teacherEmail?: string;
}

export interface CourseDateSimple {
  courseDateId: string;
  scheduledDate: string;
  dateType: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  availableSpots: number;
  isAvailable: boolean;
}

export interface CourseDateListResponse {
  courseDates: CourseDateItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCourseDateRequest {
  courseId: string;
  dateType: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  teacherId?: string;
}

export interface UpdateCourseDateRequest {
  dateType?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  isActive?: boolean;
  teacherId?: string;
}

export interface BulkCreateCourseDatesRequest {
  courseId: string;
  dates: string[];
  dateType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class CourseDateService {
  // Get all course dates with filtering
  async getCourseDates(filter?: {
    courseId?: string;
    dateType?: string;
    fromDate?: string;
    toDate?: string;
    isActive?: boolean;
    hasAvailability?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<CourseDateListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.COURSE_DATE.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.COURSE_DATE.BASE;
    return apiService.get<ApiResponse<CourseDateListResponse>>(endpoint);
  }

  // Get course dates for a specific course
  async getCourseDatesForCourse(
    courseId: string, 
    activeOnly: boolean = true
  ): Promise<ApiResponse<CourseDateSimple[]>> {
    return apiService.get<ApiResponse<CourseDateSimple[]>>(
      `${API_CONFIG.ENDPOINTS.COURSE_DATE.FOR_COURSE(courseId)}?activeOnly=${activeOnly}`
    );
  }

  // Get single course date by ID
  async getCourseDateById(courseDateId: string): Promise<ApiResponse<CourseDateItem>> {
    return apiService.get<ApiResponse<CourseDateItem>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BY_ID(courseDateId)
    );
  }

  // Create a single course date
  async createCourseDate(data: CreateCourseDateRequest): Promise<ApiResponse<CourseDateItem>> {
    // Ensure the date is sent in YYYY-MM-DD format without timezone conversion
    const requestData = {
      ...data,
      scheduledDate: data.scheduledDate.includes('T') 
        ? data.scheduledDate.split('T')[0]  // Extract date part if ISO string
        : data.scheduledDate  // Already in YYYY-MM-DD format
    };
    
    return apiService.post<ApiResponse<CourseDateItem>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BASE,
      requestData
    );
  }

  // Bulk create course dates
  async bulkCreateCourseDates(data: BulkCreateCourseDatesRequest): Promise<ApiResponse<null>> {
    // Ensure dates are sent in YYYY-MM-DD format
    const requestData = {
      ...data,
      dates: data.dates.map(date => 
        date.includes('T') ? date.split('T')[0] : date
      )
    };
    
    return apiService.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BULK,
      requestData
    );
  }

  // Update a course date
  async updateCourseDate(
    courseDateId: string, 
    data: UpdateCourseDateRequest
  ): Promise<ApiResponse<CourseDateItem>> {
    // Ensure the date is sent in YYYY-MM-DD format if provided
    const requestData = {
      ...data,
      scheduledDate: data.scheduledDate && data.scheduledDate.includes('T')
        ? data.scheduledDate.split('T')[0]
        : data.scheduledDate
    };
    
    return apiService.put<ApiResponse<CourseDateItem>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BY_ID(courseDateId),
      requestData
    );
  }

  // Delete a course date
  async deleteCourseDate(courseDateId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BY_ID(courseDateId)
    );
  }

  // Bulk delete course dates
  async bulkDeleteCourseDates(
    _courseId: string, 
    _courseDateIds: string[]
  ): Promise<ApiResponse<null>> {
    // TODO: Implement bulk delete with proper body handling
    // For now, this method is a placeholder
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.BULK_DELETE
    );
  }

  // Toggle course date status
  async toggleCourseDateStatus(courseDateId: string): Promise<ApiResponse<null>> {
    return apiService.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.COURSE_DATE.TOGGLE_STATUS(courseDateId),
      {}
    );
  }
}

export const courseDateService = new CourseDateService();