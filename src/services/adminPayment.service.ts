import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Types
export interface AdminPaymentProof {
  paymentProofId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  coursePrice: number;
  receiptFileUrl: string;
  receiptFileName: string;
  transactionId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod?: string;
  bankName?: string;
  referenceNumber?: string;
  uploadedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface AdminPaymentListResponse {
  paymentProofs: AdminPaymentProof[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RecentPaymentActivity {
  paymentProofId: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: string;
  activityDate: string;
}

export interface AdminPaymentStats {
  pendingCount: number;
  verifiedCount: number;
  rejectedCount: number;
  totalCount: number;
  totalVerifiedAmount: number;
  totalPendingAmount: number;
  recentActivity: RecentPaymentActivity[];
}

export interface AdminPaymentFilter {
  status?: string;
  studentId?: string;
  courseId?: string;
  fromDate?: string;
  toDate?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface VerifyPaymentRequest {
  approve: boolean;
  rejectionReason?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class AdminPaymentService {
  /**
   * Get all payment proofs for admin review
   */
  async getPaymentProofs(filter?: AdminPaymentFilter): Promise<ApiResponse<AdminPaymentListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.BASE;
    return apiService.get<ApiResponse<AdminPaymentListResponse>>(endpoint);
  }

  /**
   * Get a single payment proof by ID
   */
  async getPaymentProofById(paymentProofId: string): Promise<ApiResponse<AdminPaymentProof>> {
    return apiService.get<ApiResponse<AdminPaymentProof>>(
      API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.BY_ID(paymentProofId)
    );
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(): Promise<ApiResponse<AdminPaymentStats>> {
    return apiService.get<ApiResponse<AdminPaymentStats>>(
      API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.STATS
    );
  }

  /**
   * Verify or reject a payment
   */
  async verifyPayment(
    paymentProofId: string,
    adminId: string,
    request: VerifyPaymentRequest
  ): Promise<ApiResponse<null>> {
    return apiService.put<ApiResponse<null>>(
      `${API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.VERIFY(paymentProofId)}?adminId=${adminId}`,
      request
    );
  }

  /**
   * Download payment receipt file
   */
  async downloadReceipt(paymentProofId: string): Promise<Blob> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.DOWNLOAD(paymentProofId)}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to download receipt');
    }

    return response.blob();
  }

  /**
   * Get the download URL for a receipt (for direct linking)
   */
  getReceiptDownloadUrl(paymentProofId: string): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_PAYMENTS.DOWNLOAD(paymentProofId)}`;
  }
}

export const adminPaymentService = new AdminPaymentService();
