import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface ScheduleItem {
  scheduleId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  courseDateId?: string;
  eventTitle: string;
  eventType: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  currentEnrollments: number;
  status: string;
  createdAt: string;
  // Teacher information
  teacherId?: string;
  teacherName?: string;
  teacherEmail?: string;
}

export interface ScheduleCalendarItem {
  scheduleId: string;
  eventTitle: string;
  eventType: string;
  courseCode: string;
  courseName: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  status: string;
  color: string;
  bgColor: string;
  // Teacher information
  teacherId?: string;
  teacherName?: string;
}

export interface ScheduleListResponse {
  schedules: ScheduleItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateScheduleRequest {
  courseId: string;
  courseDateId?: string;
  eventTitle: string;
  eventType: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  teacherId?: string;
}

export interface UpdateScheduleRequest {
  courseId?: string;
  courseDateId?: string;
  eventTitle?: string;
  eventType?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  maxCapacity?: number;
  status?: string;
  teacherId?: string;
}

export interface ScheduleFilter {
  courseId?: string;
  eventType?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  location?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class ScheduleService {
  // Get all schedules with filtering
  async getSchedules(filter?: ScheduleFilter): Promise<ApiResponse<ScheduleListResponse>> {
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
      ? `${API_CONFIG.ENDPOINTS.SCHEDULE.BASE}?${queryString}`
      : API_CONFIG.ENDPOINTS.SCHEDULE.BASE;
    return apiService.get<ApiResponse<ScheduleListResponse>>(endpoint);
  }

  // Get schedules for calendar view
  async getSchedulesForCalendar(
    fromDate?: string, 
    toDate?: string, 
    courseId?: string
  ): Promise<ApiResponse<ScheduleCalendarItem[]>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (courseId) params.append('courseId', courseId);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.SCHEDULE.CALENDAR}?${queryString}`
      : API_CONFIG.ENDPOINTS.SCHEDULE.CALENDAR;
    return apiService.get<ApiResponse<ScheduleCalendarItem[]>>(endpoint);
  }

  // Get schedule by ID
  async getScheduleById(scheduleId: string): Promise<ApiResponse<ScheduleItem>> {
    return apiService.get<ApiResponse<ScheduleItem>>(
      API_CONFIG.ENDPOINTS.SCHEDULE.BY_ID(scheduleId)
    );
  }

  // Create a new schedule
  async createSchedule(data: CreateScheduleRequest): Promise<ApiResponse<ScheduleItem>> {
    // Ensure the date is sent in YYYY-MM-DD format
    const requestData = {
      ...data,
      scheduledDate: data.scheduledDate.includes('T') 
        ? data.scheduledDate.split('T')[0]
        : data.scheduledDate
    };
    
    return apiService.post<ApiResponse<ScheduleItem>>(
      API_CONFIG.ENDPOINTS.SCHEDULE.BASE,
      requestData
    );
  }

  // Update a schedule
  async updateSchedule(
    scheduleId: string, 
    data: UpdateScheduleRequest
  ): Promise<ApiResponse<ScheduleItem>> {
    const requestData = {
      ...data,
      scheduledDate: data.scheduledDate && data.scheduledDate.includes('T')
        ? data.scheduledDate.split('T')[0]
        : data.scheduledDate
    };
    
    return apiService.put<ApiResponse<ScheduleItem>>(
      API_CONFIG.ENDPOINTS.SCHEDULE.BY_ID(scheduleId),
      requestData
    );
  }

  // Delete a schedule
  async deleteSchedule(scheduleId: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.SCHEDULE.BY_ID(scheduleId)
    );
  }

  // Update schedule status
  async updateScheduleStatus(scheduleId: string, status: string): Promise<ApiResponse<null>> {
    return apiService.patch<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.SCHEDULE.UPDATE_STATUS(scheduleId),
      { status }
    );
  }
}

export const scheduleService = new ScheduleService();
