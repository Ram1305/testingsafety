import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Types
export interface StudentBrowseCourse {
  courseId: string;
  courseCode: string;
  courseName: string;
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
  nextBatchDate?: string;
  availableDates: AvailableDate[];
}

export interface AvailableDate {
  courseDateId: string;
  scheduledDate: string;
  sessionCount: number;
  sessionTypes: string;
  location?: string;
  availableSpots: number;
  isAvailable: boolean;
}

export interface StudentEnrolledCourse {
  enrollmentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  categoryName?: string;
  imageUrl?: string;
  instructor?: string;
  batchCode?: string;
  progress: number;
  theoryCompleted: number;
  theoryTotal: number;
  practicalCompleted: number;
  practicalTotal: number;
  status: string;
  paymentStatus: string;
  enrolledAt: string;
  selectedExamDate?: string;
  selectedTheoryDate?: string;
  quizCompleted: boolean;
}

export interface EnrollmentResponse {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  categoryName?: string;
  quizAttemptId: string;
  quizScore: number;
  selectedExamDateId?: string;
  selectedExamDate?: string;
  selectedTheoryDateId?: string;
  selectedTheoryDate?: string;
  amountPaid: number;
  paymentStatus: string;
  paymentVerifiedAt?: string;
  isAdminBypassed: boolean;
  status: string;
  enrolledAt: string;
  completedAt?: string;
  paymentProof?: PaymentProofResponse;
}

export interface PaymentProofResponse {
  paymentProofId: string;
  enrollmentId: string;
  receiptFileUrl: string;
  transactionId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod?: string;
  bankName?: string;
  referenceNumber?: string;
  uploadedAt: string;
  status: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface CreateEnrollmentRequest {
  courseId: string;
  quizAttemptId?: string;  // Now optional - quiz can be taken after payment
  selectedExamDateId?: string;
  selectedTheoryDateId?: string;
}

export interface SubmitPaymentProofRequest {
  enrollmentId: string;
  transactionId: string;
  amountPaid: number;
  receiptFile: File;
  paymentDate?: string;
  paymentMethod?: string;
  bankName?: string;
  referenceNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface EnrollmentListResponse {
  enrollments: EnrollmentResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Add this interface after existing interfaces
export interface BookCourseRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  courseId: string;
  selectedCourseDateId: string;
  transactionId: string;
  amountPaid: number;
  receiptFile: File;
  paymentDate?: string;
  paymentMethod?: string;
  bankName?: string;
  referenceNumber?: string;
}

export interface BookCourseResponse {
  userId: string;
  studentId: string;
  enrollmentId: string;
  paymentProofId: string;
  studentName: string;
  email: string;
  courseName: string;
  courseCode: string;
  selectedDate: string;
  amountPaid: number;
  paymentStatus: string;
  enrollmentStatus: string;
  bookedAt: string;
}

class EnrollmentService {
  /**
   * Get available courses for a student to browse
   */
  async getAvailableCourses(studentId: string, search?: string): Promise<ApiResponse<StudentBrowseCourse[]>> {
    const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<ApiResponse<StudentBrowseCourse[]>>(
      `${API_CONFIG.ENDPOINTS.ENROLLMENT.BROWSE(studentId)}${searchParam}`
    );
  }

  /**
   * Get a student's enrolled courses
   */
  async getStudentEnrollments(studentId: string): Promise<ApiResponse<StudentEnrolledCourse[]>> {
    return apiService.get<ApiResponse<StudentEnrolledCourse[]>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.STUDENT(studentId)
    );
  }

  /**
   * Create a new enrollment
   */
  async createEnrollment(studentId: string, data: CreateEnrollmentRequest): Promise<ApiResponse<EnrollmentResponse>> {
    return apiService.post<ApiResponse<EnrollmentResponse>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.CREATE(studentId),
      data
    );
  }

  /**
   * Get enrollment by ID
   */
  async getEnrollmentById(enrollmentId: string): Promise<ApiResponse<EnrollmentResponse>> {
    return apiService.get<ApiResponse<EnrollmentResponse>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.BY_ID(enrollmentId)
    );
  }

  /**
   * Get all enrollments with filtering (Admin)
   */
  async getEnrollments(filter?: {
    studentId?: string;
    courseId?: string;
    status?: string;
    paymentStatus?: string;
    fromDate?: string;
    toDate?: string;
    searchQuery?: string;
    sortBy?: string;
    sortDescending?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<EnrollmentListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.ENROLLMENT.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.ENROLLMENT.BASE;
    return apiService.get<ApiResponse<EnrollmentListResponse>>(endpoint);
  }

  /**
   * Cancel an enrollment (before payment)
   */
  async cancelEnrollment(enrollmentId: string, studentId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.CANCEL(enrollmentId, studentId)
    );
  }

  /**
   * Submit payment proof for an enrollment
   */
  async submitPaymentProof(
    enrollmentId: string,
    studentId: string,
    data: Omit<SubmitPaymentProofRequest, 'enrollmentId'>
  ): Promise<ApiResponse<PaymentProofResponse>> {
    const formData = new FormData();
    formData.append('transactionId', data.transactionId);
    formData.append('amountPaid', data.amountPaid.toString());
    formData.append('receiptFile', data.receiptFile);
    
    if (data.paymentDate) {
      formData.append('paymentDate', data.paymentDate);
    }
    if (data.paymentMethod) {
      formData.append('paymentMethod', data.paymentMethod);
    }
    if (data.bankName) {
      formData.append('bankName', data.bankName);
    }
    if (data.referenceNumber) {
      formData.append('referenceNumber', data.referenceNumber);
    }

    // Use fetch directly for FormData
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENROLLMENT.PAYMENT(enrollmentId, studentId)}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit payment proof');
    }

    return response.json();
  }

  /**
   * Get payment proof for an enrollment
   */
  async getPaymentProof(enrollmentId: string): Promise<ApiResponse<PaymentProofResponse>> {
    return apiService.get<ApiResponse<PaymentProofResponse>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.GET_PAYMENT(enrollmentId)
    );
  }

  /**
   * Verify payment proof (Admin only)
   */
  async verifyPayment(
    paymentProofId: string,
    adminId: string,
    approve: boolean,
    rejectionReason?: string
  ): Promise<ApiResponse<null>> {
    return apiService.put<ApiResponse<null>>(
      `${API_CONFIG.ENDPOINTS.ENROLLMENT.VERIFY_PAYMENT(paymentProofId)}?adminId=${adminId}`,
      { approve, rejectionReason }
    );
  }

  /**
   * Check if a student can enroll in a course
   */
  async canEnroll(studentId: string, courseId: string): Promise<ApiResponse<{ canEnroll: boolean; alreadyEnrolled: boolean }>> {
    return apiService.get<ApiResponse<{ canEnroll: boolean; alreadyEnrolled: boolean }>>(
      API_CONFIG.ENDPOINTS.ENROLLMENT.CAN_ENROLL(studentId, courseId)
    );
  }

  /**
   * Book a course with registration and payment (for new users)
   */
  async bookCourse(data: BookCourseRequest): Promise<ApiResponse<BookCourseResponse>> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('courseId', data.courseId);
    formData.append('selectedCourseDateId', data.selectedCourseDateId);
    formData.append('transactionId', data.transactionId);
    formData.append('amountPaid', data.amountPaid.toString());
    formData.append('receiptFile', data.receiptFile);
    
    if (data.paymentDate) {
      formData.append('paymentDate', data.paymentDate);
    }
    if (data.paymentMethod) {
      formData.append('paymentMethod', data.paymentMethod);
    }
    if (data.bankName) {
      formData.append('bankName', data.bankName);
    }
    if (data.referenceNumber) {
      formData.append('referenceNumber', data.referenceNumber);
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENROLLMENT.BOOK}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to book course');
    }

    return result;
  }
}

export const enrollmentService = new EnrollmentService();
