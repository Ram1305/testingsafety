import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface StudentScheduleCalendarItem {
  scheduleId: string;
  enrollmentId: string;
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
  teacherId?: string;
  teacherName?: string;
  enrolledAt: string;
  enrollmentStatus: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class StudentScheduleService {
  /**
   * Get schedule events for a student based on their verified enrollments.
   * Only shows schedules for courses where payment is verified.
   */
  async getStudentScheduleForCalendar(
    studentId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<ApiResponse<StudentScheduleCalendarItem[]>> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.SCHEDULE.STUDENT_CALENDAR(studentId)}?${queryString}`
      : API_CONFIG.ENDPOINTS.SCHEDULE.STUDENT_CALENDAR(studentId);
    
    return apiService.get<ApiResponse<StudentScheduleCalendarItem[]>>(endpoint);
  }
}

export const studentScheduleService = new StudentScheduleService();
