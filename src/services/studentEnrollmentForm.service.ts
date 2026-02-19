import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Types
export interface EnrollmentFormResponse {
  studentId: string;
  studentName: string;
  email: string;
  enrollmentFormCompleted: boolean;
  enrollmentFormSubmittedAt: string | null;
  enrollmentFormStatus: string | null; // Pending, Approved, Rejected
  enrollmentFormReviewedBy: string | null;
  reviewedByName: string | null;
  enrollmentFormReviewedAt: string | null;
  enrollmentFormReviewNotes: string | null;

  // Section 1 - Applicant Information
  title: string | null;
  surname: string | null;
  givenName: string | null;
  middleName: string | null;
  preferredName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  homePhone: string | null;
  workPhone: string | null;
  mobile: string | null;

  residentialAddress: string | null;
  residentialSuburb: string | null;
  residentialState: string | null;
  residentialPostcode: string | null;

  postalAddressDifferent: boolean;
  postalAddress: string | null;
  postalSuburb: string | null;
  postalState: string | null;
  postalPostcode: string | null;

  primaryIdDocumentUrl: string | null;
  secondaryIdDocumentUrl: string | null;

  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactNumber: string | null;
  emergencyPermission: string | null;

  // Section 2 - USI
  usi: string | null;
  usiAccessPermission: boolean;
  usiApplyThroughSTA: string | null;
  usiAuthoriseName: string | null;
  usiConsent: boolean;
  townCityOfBirth: string | null;
  overseasCityOfBirth: string | null;
  usiIdType: string | null;
  usiIdDocumentUrl: string | null;

  driversLicenceState: string | null;
  driversLicenceNumber: string | null;
  medicareNumber: string | null;
  medicareIRN: string | null;
  medicareCardColor: string | null;
  medicareExpiry: string | null;
  birthCertificateState: string | null;
  immiCardNumber: string | null;
  australianPassportNumber: string | null;
  nonAustralianPassportNumber: string | null;
  nonAustralianPassportCountry: string | null;
  citizenshipStockNumber: string | null;
  citizenshipAcquisitionDate: string | null;
  descentAcquisitionDate: string | null;

  // Section 3 - Education and Employment
  schoolLevel: string | null;
  schoolCompleteYear: string | null;
  schoolName: string | null;
  schoolInAustralia: boolean;
  schoolState: string | null;
  schoolPostcode: string | null;
  schoolCountry: string | null;
  hasPostSecondaryQualification: string | null;
  qualificationLevels: string[] | null;
  qualificationDetails: string | null;
  qualificationEvidenceUrl: string | null;
  employmentStatus: string | null;
  employerName: string | null;
  supervisorName: string | null;
  employerAddress: string | null;
  employerEmail: string | null;
  employerPhone: string | null;
  trainingReason: string | null;
  trainingReasonOther: string | null;

  // Section 4 - Additional Information
  countryOfBirth: string | null;
  speaksOtherLanguage: string | null;
  homeLanguage: string | null;
  indigenousStatus: string | null;
  hasDisability: string | null;
  disabilityTypes: string[] | null;
  disabilityNotes: string | null;

  // Section 5 - Privacy and Terms
  acceptedPrivacyNotice: boolean;
  acceptedTermsAndConditions: boolean;
  declarationName: string | null;
  declarationDate: string | null;
  signatureData: string | null;
}

export interface SubmitEnrollmentFormRequest {
  // Section 1 - Applicant Information
  title: string;
  surname: string;
  givenName: string;
  middleName?: string;
  preferredName?: string;
  dateOfBirth: string;
  gender: string;
  homePhone?: string;
  workPhone?: string;
  mobile: string;
  email: string;

  residentialAddress: string;
  residentialSuburb: string;
  residentialState: string;
  residentialPostcode: string;

  postalAddressDifferent: boolean;
  postalAddress?: string;
  postalSuburb?: string;
  postalState?: string;
  postalPostcode?: string;

  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNumber: string;
  emergencyPermission: string;

  // Section 2 - USI
  usi?: string;
  usiAccessPermission: boolean;
  usiApplyThroughSTA: string;
  usiAuthoriseName?: string;
  usiConsent?: boolean;
  townCityOfBirth?: string;
  overseasCityOfBirth?: string;
  usiIdType?: string;

  driversLicenceState?: string;
  driversLicenceNumber?: string;
  medicareNumber?: string;
  medicareIRN?: string;
  medicareCardColor?: string;
  medicareExpiry?: string;
  birthCertificateState?: string;
  immiCardNumber?: string;
  australianPassportNumber?: string;
  nonAustralianPassportNumber?: string;
  nonAustralianPassportCountry?: string;
  citizenshipStockNumber?: string;
  citizenshipAcquisitionDate?: string;
  descentAcquisitionDate?: string;

  // Section 3 - Education and Employment
  schoolLevel: string;
  schoolCompleteYear: string;
  schoolName: string;
  schoolInAustralia: boolean;
  schoolState?: string;
  schoolPostcode?: string;
  schoolCountry?: string;
  hasPostSecondaryQualification: string;
  qualificationLevels?: string[];
  qualificationDetails?: string;
  employmentStatus: string;
  employerName?: string;
  supervisorName?: string;
  employerAddress?: string;
  employerEmail?: string;
  employerPhone?: string;
  trainingReason: string;
  trainingReasonOther?: string;

  // Section 4 - Additional Information
  countryOfBirth: string;
  speaksOtherLanguage: string;
  homeLanguage?: string;
  indigenousStatus: string;
  hasDisability: string;
  disabilityTypes?: string[];
  disabilityNotes?: string;

  // Section 5 - Privacy and Terms
  acceptedPrivacyNotice: boolean;
  acceptedTermsAndConditions: boolean;
  declarationName: string;
  declarationDate: string;
  signatureData: string;
}

export interface EnrollmentFormListItem {
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  status: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  enrollmentCount: number;
  isActive: boolean;
}

export interface EnrollmentFormListResponse {
  enrollmentForms: EnrollmentFormListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EnrollmentFormStats {
  totalSubmitted: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  notSubmittedCount: number;
  lastSubmittedAt: string | null;
  lastReviewedAt: string | null;
}

export interface EnrollmentFormFilter {
  searchQuery?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ReviewEnrollmentFormRequest {
  approve: boolean;
  reviewNotes?: string;
}

export interface PublicEnrollmentFormRequest extends SubmitEnrollmentFormRequest {
  password: string;
  transactionId?: string;
  paymentAmount?: number;
}

export interface PublicEnrollmentFormResponse {
  userId: string;
  studentId: string;
  email: string;
  fullName: string;
  enrollmentFormStatus: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Student Enrollment Form Service
export const studentEnrollmentFormService = {
  // Student endpoints - now require studentId parameter
  async getMyEnrollmentForm(): Promise<ApiResponse<EnrollmentFormResponse>> {
    return apiService.get<ApiResponse<EnrollmentFormResponse>>('/StudentEnrollmentForm/my-form');
  },

  async getEnrollmentFormByStudentId(studentId: string): Promise<ApiResponse<EnrollmentFormResponse>> {
    return apiService.get<ApiResponse<EnrollmentFormResponse>>(`/StudentEnrollmentForm/student/${studentId}`);
  },

  async submitEnrollmentForm(request: SubmitEnrollmentFormRequest, studentId?: string): Promise<ApiResponse<EnrollmentFormResponse>> {
    // Use the studentId-specific endpoint if studentId is provided
    if (studentId) {
      return apiService.post<ApiResponse<EnrollmentFormResponse>>(`/StudentEnrollmentForm/submit/${studentId}`, request);
    }
    return apiService.post<ApiResponse<EnrollmentFormResponse>>('/StudentEnrollmentForm/submit', request);
  },

  async updateEnrollmentForm(request: SubmitEnrollmentFormRequest, studentId?: string): Promise<ApiResponse<EnrollmentFormResponse>> {
    // Use the studentId-specific endpoint if studentId is provided
    if (studentId) {
      return apiService.put<ApiResponse<EnrollmentFormResponse>>(`/StudentEnrollmentForm/update/${studentId}`, request);
    }
    return apiService.put<ApiResponse<EnrollmentFormResponse>>('/StudentEnrollmentForm/update', request);
  },

  async uploadDocument(file: File, documentType: 'primaryId' | 'secondaryId' | 'usiId' | 'qualification', studentId?: string): Promise<ApiResponse<{ documentUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use studentId-specific endpoint if provided
    const endpoint = studentId 
      ? `/StudentEnrollmentForm/upload-document/${studentId}?documentType=${documentType}`
      : `/StudentEnrollmentForm/upload-document?documentType=${documentType}`;
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return response.json();
  },

  // Public enrollment endpoint - creates user, student, and submits form
  async submitPublicEnrollmentForm(request: PublicEnrollmentFormRequest): Promise<ApiResponse<PublicEnrollmentFormResponse>> {
    return apiService.post<ApiResponse<PublicEnrollmentFormResponse>>('/StudentEnrollmentForm/public/submit', request);
  },

  // Admin endpoints
  async getEnrollmentFormsForAdmin(filter: EnrollmentFormFilter = {}): Promise<ApiResponse<EnrollmentFormListResponse>> {
    const params = new URLSearchParams();
    if (filter.searchQuery) params.append('searchQuery', filter.searchQuery);
    if (filter.status) params.append('status', filter.status);
    if (filter.fromDate) params.append('fromDate', filter.fromDate);
    if (filter.toDate) params.append('toDate', filter.toDate);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortDescending !== undefined) params.append('sortDescending', String(filter.sortDescending));
    if (filter.page) params.append('page', String(filter.page));
    if (filter.pageSize) params.append('pageSize', String(filter.pageSize));

    return apiService.get<ApiResponse<EnrollmentFormListResponse>>(`/StudentEnrollmentForm/admin/list?${params.toString()}`);
  },

  async getEnrollmentFormByIdForAdmin(studentId: string): Promise<ApiResponse<EnrollmentFormResponse>> {
    return apiService.get<ApiResponse<EnrollmentFormResponse>>(`/StudentEnrollmentForm/admin/${studentId}`);
  },

  async reviewEnrollmentForm(studentId: string, request: ReviewEnrollmentFormRequest): Promise<ApiResponse<null>> {
    return apiService.post<ApiResponse<null>>(`/StudentEnrollmentForm/admin/${studentId}/review`, request);
  },

  async updateEnrollmentFormByAdmin(studentId: string, request: SubmitEnrollmentFormRequest): Promise<ApiResponse<EnrollmentFormResponse>> {
    return apiService.put<ApiResponse<EnrollmentFormResponse>>(`/StudentEnrollmentForm/admin/${studentId}`, request);
  },

  async getEnrollmentFormStats(): Promise<ApiResponse<EnrollmentFormStats>> {
    return apiService.get<ApiResponse<EnrollmentFormStats>>('/StudentEnrollmentForm/admin/stats');
  },

  async uploadDocumentForStudent(studentId: string, file: File, documentType: 'primaryId' | 'secondaryId' | 'usiId' | 'qualification'): Promise<ApiResponse<{ documentUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${API_CONFIG.BASE_URL}/StudentEnrollmentForm/admin/${studentId}/upload-document?documentType=${documentType}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return response.json();
  },

  // PDF Generation endpoints
  async getEnrollmentFormPdfHtml(studentId: string): Promise<string> {
    const url = `${API_CONFIG.BASE_URL}/StudentEnrollmentForm/admin/${studentId}/pdf/html`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response.text();
  },

  async downloadEnrollmentFormPdf(studentId: string, studentName: string): Promise<void> {
    // Open the static studentEnrolment form with the form ID as a query parameter
    // This will load the enrollment data from the API and display it in the PDF-style form
    // and automatically trigger print dialog
    const formUrl = `/studentEnrolment/index.html?id=${studentId}&print=true`;
    window.open(formUrl, '_blank');
  },

  async viewEnrollmentFormPdf(studentId: string): Promise<void> {
    // Open the static studentEnrolment form with the form ID as a query parameter
    // This will load the enrollment data from the API and display it in the PDF-style form
    const formUrl = `/studentEnrolment/index.html?id=${studentId}`;
    window.open(formUrl, '_blank');
  },

  // Alternative: View using backend-generated HTML
  async viewEnrollmentFormHtml(studentId: string): Promise<void> {
    const html = await this.getEnrollmentFormPdfHtml(studentId);
    
    // Open in new window for viewing
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(html);
      viewWindow.document.close();
    }
  },
};
