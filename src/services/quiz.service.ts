import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface SubmitQuizSectionResult {
  sectionName: string;
  totalQuestions: number;
  correctAnswers: number;
  sectionPercentage: number;
  sectionPassed: boolean;
}

export interface SubmitQuizRequest {
  studentId: string;
  totalQuestions: number;
  correctAnswers: number;
  overallPercentage: number;
  isPassed: boolean;
  declarationName: string;
  sectionResults: SubmitQuizSectionResult[];
}

// Guest quiz submission (from landing page LLND test)
export interface SubmitGuestQuizRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  totalQuestions: number;
  correctAnswers: number;
  overallPercentage: number;
  isPassed: boolean;
  declarationName: string;
  sectionResults: SubmitQuizSectionResult[];
}

export interface GuestQuizSubmissionResult {
  success: boolean;
  message: string;
  userId: string;
  studentId: string;
  email: string;
  fullName: string;
  quizAttemptId: string;
  isPassed: boolean;
  overallPercentage: number;
  canEnroll: boolean;
  sectionResults: QuizSectionResultResponse[];
}

export interface QuizSectionResultResponse {
  sectionResultId: string;
  sectionName: string;
  totalQuestions: number;
  correctAnswers: number;
  sectionPercentage: number;
  sectionPassed: boolean;
}

export interface QuizSubmissionResult {
  success: boolean;
  message: string;
  quizAttemptId: string;
  isPassed: boolean;
  overallPercentage: number;
  canEnroll: boolean;
  sectionResults: QuizSectionResultResponse[];
}

export interface QuizAttemptResponse {
  quizAttemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  attemptDate: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  overallPercentage: number;
  isPassed: boolean;
  status: string;
  completedAt: string | null;
  hasAdminBypass: boolean;
  sectionResults: QuizSectionResultResponse[];
}

export interface StudentQuizStatus {
  studentId: string;
  hasAttemptedQuiz: boolean;
  hasPassedQuiz: boolean;
  hasAdminBypass: boolean;
  canEnroll: boolean;
  totalAttempts: number;
  latestAttempt: QuizAttemptResponse | null;
  passedAttempt: QuizAttemptResponse | null;
}

export interface QuizAttemptListResponse {
  quizAttempts: QuizAttemptResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class QuizService {
  async submitQuiz(request: SubmitQuizRequest): Promise<QuizSubmissionResult> {
    return apiService.post<QuizSubmissionResult>(
      API_CONFIG.ENDPOINTS.QUIZ.SUBMIT,
      request
    );
  }

  async submitGuestQuiz(request: SubmitGuestQuizRequest): Promise<GuestQuizSubmissionResult> {
    return apiService.post<GuestQuizSubmissionResult>(
      API_CONFIG.ENDPOINTS.QUIZ.SUBMIT_GUEST,
      request
    );
  }

  async getQuizAttemptById(quizAttemptId: string): Promise<QuizAttemptResponse> {
    return apiService.get<QuizAttemptResponse>(
      `${API_CONFIG.ENDPOINTS.QUIZ.GET_BY_ID}/${quizAttemptId}`
    );
  }

  async getQuizAttempts(params?: {
    studentId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    isPassed?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<QuizAttemptListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const url = query 
      ? `${API_CONFIG.ENDPOINTS.QUIZ.GET_ALL}?${query}`
      : API_CONFIG.ENDPOINTS.QUIZ.GET_ALL;
    return apiService.get<QuizAttemptListResponse>(url);
  }

  async getStudentQuizStatus(studentId: string): Promise<StudentQuizStatus> {
    return apiService.get<StudentQuizStatus>(
      `${API_CONFIG.ENDPOINTS.QUIZ.STUDENT_STATUS}/${studentId}/status`
    );
  }

  async getLatestQuizAttempt(studentId: string): Promise<QuizAttemptResponse> {
    return apiService.get<QuizAttemptResponse>(
      `${API_CONFIG.ENDPOINTS.QUIZ.STUDENT_LATEST}/${studentId}/latest`
    );
  }

  async hasStudentPassedQuiz(studentId: string): Promise<{ studentId: string; hasPassed: boolean }> {
    return apiService.get<{ studentId: string; hasPassed: boolean }>(
      `${API_CONFIG.ENDPOINTS.QUIZ.HAS_PASSED}/${studentId}/has-passed`
    );
  }

  async canStudentEnroll(studentId: string): Promise<{ studentId: string; canEnroll: boolean }> {
    return apiService.get<{ studentId: string; canEnroll: boolean }>(
      `${API_CONFIG.ENDPOINTS.QUIZ.CAN_ENROLL}/${studentId}/can-enroll`
    );
  }
}

export const quizService = new QuizService();