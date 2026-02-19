import { API_CONFIG } from '../config/api.config';

// Request DTOs
export interface CreateAdminBypassRequest {
  studentId: string;
  quizAttemptId: string;
  reason?: string;
}

export interface RejectStudentRequest {
  studentId: string;
  quizAttemptId: string;
  reason?: string;
}

// Response DTOs
export interface AdminBypassResponse {
  bypassId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  quizAttemptId: string;
  bypassedBy: string;
  bypassedByName: string;
  reason: string;
  bypassedAt: string;
  isActive: boolean;
}

export interface QuizSectionResultResponse {
  sectionResultId: string;
  sectionName: string;
  totalQuestions: number;
  correctAnswers: number;
  sectionPercentage: number;
  sectionPassed: boolean;
}

export interface AdminQuizResultResponse {
  quizAttemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  attemptDate: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  overallPercentage: number;
  isPassed: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  completedAt?: string;
  hasAdminBypass: boolean;
  adminBypass?: AdminBypassResponse;
  sectionResults: QuizSectionResultResponse[];
}

export interface AdminQuizResultListResponse {
  results: AdminQuizResultResponse[];
  totalCount: number;
  passedCount: number;
  failedCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface QuizStatisticsResponse {
  totalAttempts: number;
  passedCount: number;
  failedCount: number;
  pendingReviewCount: number;
  approvedBypassCount: number;
  rejectedCount: number;
  averageScore: number;
  passRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

class AdminQuizService {
  private baseUrl = API_CONFIG.BASE_URL;

  // Helper method to get admin user ID from localStorage
  private getAdminUserId(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.userId || '';
    }
    return '';
  }

  // Private request method for making API calls
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all quiz results with filtering and pagination
  async getAllQuizResults(params?: {
    search?: string;
    status?: string;
    isPassed?: boolean;
    fromDate?: string;
    toDate?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ApiResponse<AdminQuizResultListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const url = query
      ? `${API_CONFIG.ENDPOINTS.ADMIN_QUIZ.RESULTS}?${query}`
      : API_CONFIG.ENDPOINTS.ADMIN_QUIZ.RESULTS;

    return this.request<ApiResponse<AdminQuizResultListResponse>>(url, {
      method: 'GET',
    });
  }

  // Get a specific quiz result by ID
  async getQuizResultById(quizAttemptId: string): Promise<ApiResponse<AdminQuizResultResponse>> {
    return this.request<ApiResponse<AdminQuizResultResponse>>(
      `${API_CONFIG.ENDPOINTS.ADMIN_QUIZ.RESULTS}/${quizAttemptId}`,
      { method: 'GET' }
    );
  }

  // Get quiz statistics
  async getQuizStatistics(): Promise<ApiResponse<QuizStatisticsResponse>> {
    return this.request<ApiResponse<QuizStatisticsResponse>>(
      API_CONFIG.ENDPOINTS.ADMIN_QUIZ.STATISTICS,
      { method: 'GET' }
    );
  }

  // Create admin bypass for a failed student
  async createAdminBypass(request: CreateAdminBypassRequest): Promise<ApiResponse<AdminBypassResponse>> {
    return this.request<ApiResponse<AdminBypassResponse>>(
      API_CONFIG.ENDPOINTS.ADMIN_QUIZ.BYPASS,
      {
        method: 'POST',
        headers: {
          'X-Admin-UserId': this.getAdminUserId(),
        },
        body: JSON.stringify(request),
      }
    );
  }

  // Reject a student's quiz attempt
  async rejectStudent(request: RejectStudentRequest): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.ADMIN_QUIZ.REJECT,
      {
        method: 'POST',
        headers: {
          'X-Admin-UserId': this.getAdminUserId(),
        },
        body: JSON.stringify(request),
      }
    );
  }

  // Revoke an admin bypass
  async revokeAdminBypass(bypassId: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(
      `${API_CONFIG.ENDPOINTS.ADMIN_QUIZ.BYPASS}/${bypassId}`,
      {
        method: 'DELETE',
        headers: {
          'X-Admin-UserId': this.getAdminUserId(),
        },
      }
    );
  }

  // Get all admin bypasses
  async getAllAdminBypasses(): Promise<ApiResponse<AdminBypassResponse[]>> {
    return this.request<ApiResponse<AdminBypassResponse[]>>(
      API_CONFIG.ENDPOINTS.ADMIN_QUIZ.BYPASSES,
      { method: 'GET' }
    );
  }
}

export const adminQuizService = new AdminQuizService();