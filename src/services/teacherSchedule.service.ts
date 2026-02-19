import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface TeacherScheduleCalendarItem {
  scheduleId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  categoryName?: string;
  eventTitle: string;
  eventType: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingLink?: string;
  status: string;
  color: string;
  bgColor: string;
  enrolledStudentsCount: number;
  maxCapacity?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class TeacherScheduleService {
  /**
   * Get schedule events assigned to a specific teacher.
   * Only shows schedules where the teacher is assigned.
   */
  async getTeacherScheduleForCalendar(
    teacherId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<ApiResponse<TeacherScheduleCalendarItem[]>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.SCHEDULE.TEACHER_CALENDAR(teacherId)}?${queryString}`
      : API_CONFIG.ENDPOINTS.SCHEDULE.TEACHER_CALENDAR(teacherId);
    
    return apiService.get<ApiResponse<TeacherScheduleCalendarItem[]>>(endpoint);
  }
}

export const teacherScheduleService = new TeacherScheduleService();
