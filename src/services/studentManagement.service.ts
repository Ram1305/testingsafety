import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface CreateStudentRequest {
  fullName: string;
  preferredName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  passportIdType?: string;
  documentType?: string;
  passportIdNumber?: string;
  positionTitle?: string;
  employmentType?: string;
  startDate?: string;
  campusLocation?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  stateCode?: string;
  postcode?: string;
  teachingQualification?: string;
  vocationalQualifications?: string;
  complianceExpiryDate?: string;
  policeCheckStatus?: string;
  rightToWork?: string;
  permissions?: string;
}

export interface UpdateStudentRequest {
  fullName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  passportIdType?: string;
  documentType?: string;
  passportIdNumber?: string;
  positionTitle?: string;
  employmentType?: string;
  startDate?: string;
  campusLocation?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  stateCode?: string;
  postcode?: string;
  teachingQualification?: string;
  vocationalQualifications?: string;
  complianceExpiryDate?: string;
  policeCheckStatus?: string;
  rightToWork?: string;
  permissions?: string;
  isActive?: boolean;
}

export interface StudentResponse {
  studentId: string;
  userId: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  passportIdType?: string;
  documentType?: string;
  passportIdNumber?: string;
  positionTitle?: string;
  employmentType?: string;
  startDate?: string;
  campusLocation?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  stateCode?: string;
  postcode?: string;
  teachingQualification?: string;
  vocationalQualifications?: string;
  complianceExpiryDate?: string;
  policeCheckStatus?: string;
  rightToWork?: string;
  permissions?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  enrollmentCount: number;
}

export interface StudentListResponse {
  students: StudentResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface StudentStatsResponse {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  newStudentsThisMonth: number;
  studentsWithEnrollments: number;
  studentsWithCompletedCourses: number;
}

export interface StudentFilterRequest {
  searchQuery?: string;
  status?: 'active' | 'inactive';
  campusLocation?: string;
  employmentType?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class StudentManagementService {
  async getAllStudents(filter: StudentFilterRequest = {}): Promise<ApiResponse<StudentListResponse>> {
    const params = new URLSearchParams();
    
    if (filter.searchQuery) params.append('searchQuery', filter.searchQuery);
    if (filter.status) params.append('status', filter.status);
    if (filter.campusLocation) params.append('campusLocation', filter.campusLocation);
    if (filter.employmentType) params.append('employmentType', filter.employmentType);
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BASE;

    return apiService.get<ApiResponse<StudentListResponse>>(endpoint);
  }

  async getStudentById(studentId: string): Promise<ApiResponse<StudentResponse>> {
    return apiService.get<ApiResponse<StudentResponse>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BY_ID(studentId)
    );
  }

  async getStudentByUserId(userId: string): Promise<ApiResponse<StudentResponse>> {
    return apiService.get<ApiResponse<StudentResponse>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BY_USER_ID(userId)
    );
  }

  async createStudent(data: CreateStudentRequest): Promise<ApiResponse<StudentResponse>> {
    return apiService.post<ApiResponse<StudentResponse>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BASE,
      data
    );
  }

  async updateStudent(studentId: string, data: UpdateStudentRequest): Promise<ApiResponse<StudentResponse>> {
    return apiService.put<ApiResponse<StudentResponse>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BY_ID(studentId),
      data
    );
  }

  async deleteStudent(studentId: string): Promise<ApiResponse<boolean>> {
    return apiService.delete<ApiResponse<boolean>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.BY_ID(studentId)
    );
  }

  async toggleStudentStatus(studentId: string): Promise<ApiResponse<boolean>> {
    return apiService.patch<ApiResponse<boolean>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.TOGGLE_STATUS(studentId)
    );
  }

  async getStudentStats(): Promise<ApiResponse<StudentStatsResponse>> {
    return apiService.get<ApiResponse<StudentStatsResponse>>(
      API_CONFIG.ENDPOINTS.STUDENT_MANAGEMENT.STATS
    );
  }
}

export const studentManagementService = new StudentManagementService();
