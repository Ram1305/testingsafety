// Resolve API base URL: VITE_API_URL > VITE_API_BASE_URL + '/api' > default
// Set VITE_USE_HTTP=true to use http://localhost:5576/api (avoids SSL cert issues)
function getBaseUrl(): string {
  const useHttp = import.meta.env.VITE_USE_HTTP === 'true';
  if (useHttp) {
    return 'http://localhost:5576/api';
  }
  const explicit = import.meta.env.VITE_API_URL;
  if (explicit) return explicit;
  const base = import.meta.env.VITE_API_BASE_URL;
  if (base) return base.endsWith('/api') ? base : `${base}/api`;
  return 'https://localhost:7419/api';
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      CHECK_EMAIL: '/auth/check-email',
      GET_USER: '/auth/user',
    },
    SUPER_ADMIN: {
      ADMIN_MANAGEMENT: '/AdminManagement',
    },
    STUDENT_MANAGEMENT: {
      BASE: '/StudentManagement',
      BY_ID: (studentId: string) => `/StudentManagement/${studentId}`,
      BY_USER_ID: (userId: string) => `/StudentManagement/user/${userId}`,
      TOGGLE_STATUS: (studentId: string) => `/StudentManagement/${studentId}/toggle-status`,
      STATS: '/StudentManagement/stats',
    },
    QUIZ: {
      SUBMIT: '/quiz/submit',
      SUBMIT_GUEST: '/quiz/submit-guest',
      GET_BY_ID: '/quiz',
      GET_ALL: '/quiz',
      STUDENT_STATUS: '/quiz/student',
      STUDENT_LATEST: '/quiz/student',
      HAS_PASSED: '/quiz/student',
      CAN_ENROLL: '/quiz/student',
    },
    ADMIN_QUIZ: {
      RESULTS: '/admin/quiz/results',
      STATISTICS: '/admin/quiz/statistics',
      BYPASS: '/admin/quiz/bypass',
      REJECT: '/admin/quiz/reject',
      BYPASSES: '/admin/quiz/bypasses',
    },
    COURSE: {
      BASE: '/course',
      ACTIVE: '/course/active',
      FEATURED: '/course/featured',
      STATS: '/course/stats',
      CHECK_CODE: (code: string) => `/course/check-code/${code}`,
      BY_ID: (id: string) => `/course/${id}`,
      BY_CODE: (code: string) => `/course/code/${code}`,
      TOGGLE_STATUS: (id: string) => `/course/${id}/toggle-status`,
    },
    CATEGORY: {
      BASE: '/category',
      DROPDOWN: '/category/dropdown',
      REORDER: '/category/reorder',
      CHECK_NAME: (name: string) => `/category/check-name/${encodeURIComponent(name)}`,
      BY_ID: (id: string) => `/category/${id}`,
      TOGGLE_STATUS: (id: string) => `/category/${id}/toggle-status`,
    },
    COURSE_DATE: {
      BASE: '/coursedate',
      BY_ID: (id: string) => `/coursedate/${id}`,
      FOR_COURSE: (courseId: string) => `/coursedate/course/${courseId}`,
      BULK: '/coursedate/bulk',
      BULK_DELETE: '/coursedate/bulk',
      TOGGLE_STATUS: (id: string) => `/coursedate/${id}/toggle-status`,
    },
    ENROLLMENT: {
      BASE: '/enrollment',
      BOOK: '/enrollment/book',  // NEW: Book course endpoint
      BROWSE: (studentId: string) => `/enrollment/browse/${studentId}`,
      STUDENT: (studentId: string) => `/enrollment/student/${studentId}`,
      CREATE: (studentId: string) => `/enrollment/${studentId}`,
      BY_ID: (enrollmentId: string) => `/enrollment/${enrollmentId}`,
      CANCEL: (enrollmentId: string, studentId: string) => `/enrollment/${enrollmentId}/student/${studentId}`,
      PAYMENT: (enrollmentId: string, studentId: string) => `/enrollment/${enrollmentId}/payment/${studentId}`,
      GET_PAYMENT: (enrollmentId: string) => `/enrollment/${enrollmentId}/payment`,
      VERIFY_PAYMENT: (paymentProofId: string) => `/enrollment/payment/${paymentProofId}/verify`,
      CAN_ENROLL: (studentId: string, courseId: string) => `/enrollment/can-enroll/${studentId}/${courseId}`,
    },
    ADMIN_PAYMENTS: {
      BASE: '/enrollment/admin/payments',
      STATS: '/enrollment/admin/payments/stats',
      BY_ID: (paymentProofId: string) => `/enrollment/admin/payments/${paymentProofId}`,
      DOWNLOAD: (paymentProofId: string) => `/enrollment/admin/payments/${paymentProofId}/download`,
      VERIFY: (paymentProofId: string) => `/enrollment/payment/${paymentProofId}/verify`,
    },
    SCHEDULE: {
      BASE: '/schedule',
      CALENDAR: '/schedule/calendar',
      BY_ID: (id: string) => `/schedule/${id}`,
      UPDATE_STATUS: (id: string) => `/schedule/${id}/status`,
      STUDENT_CALENDAR: (studentId: string) => `/schedule/student/${studentId}/calendar`,
      TEACHER_CALENDAR: (teacherId: string) => `/schedule/teacher/${teacherId}/calendar`,
    },
    FILES: {
      UPLOAD: (folder: string) => `/files/upload/${folder}`,
      UPLOAD_MULTIPLE: (folder: string) => `/files/upload-multiple/${folder}`,
      GET: (filePath: string) => `/files/${filePath}`,
      DELETE: (filePath: string) => `/files/${filePath}`,
    },
    STUDENT_ENROLLMENT_FORM: {
      // Public
      PUBLIC_SUBMIT: '/studentenrollmentform/public/submit',
      // Student
      MY_FORM: '/studentenrollmentform/my-form',
      BY_STUDENT_ID: (studentId: string) => `/studentenrollmentform/student/${studentId}`,
      SUBMIT: '/studentenrollmentform/submit',
      SUBMIT_FOR_STUDENT: (studentId: string) => `/studentenrollmentform/submit/${studentId}`,
      UPDATE: '/studentenrollmentform/update',
      UPDATE_FOR_STUDENT: (studentId: string) => `/studentenrollmentform/update/${studentId}`,
      UPLOAD_DOCUMENT: '/studentenrollmentform/upload-document',
      UPLOAD_DOCUMENT_FOR_STUDENT: (studentId: string) => `/studentenrollmentform/upload-document/${studentId}`,
      // Admin
      ADMIN_LIST: '/studentenrollmentform/admin/list',
      ADMIN_BY_ID: (studentId: string) => `/studentenrollmentform/admin/${studentId}`,
      ADMIN_REVIEW: (studentId: string) => `/studentenrollmentform/admin/${studentId}/review`,
      ADMIN_UPDATE: (studentId: string) => `/studentenrollmentform/admin/${studentId}`,
      ADMIN_STATS: '/studentenrollmentform/admin/stats',
      ADMIN_UPLOAD_DOCUMENT: (studentId: string) => `/studentenrollmentform/admin/${studentId}/upload-document`,
      // PDF
      PDF_HTML: (studentId: string) => `/studentenrollmentform/admin/${studentId}/pdf/html`,
      PDF_DOWNLOAD: (studentId: string) => `/studentenrollmentform/admin/${studentId}/pdf/download`,
    },
    PUBLIC_ENROLLMENT: {
      // Dropdowns
      COURSES: '/publicenrollment/courses',
      COURSE_DATES: (courseId: string) => `/publicenrollment/courses/${courseId}/dates`,
      // Registration & Enrollment
      REGISTER: '/publicenrollment/register',
      ENROLL: '/publicenrollment/enroll',
      LINK_BY_CODE: (code: string) => `/publicenrollment/link/${code}`,
      // Admin - Enrollment Links
      ADMIN_LINKS: '/publicenrollment/admin/links',
      ADMIN_LINK_BY_ID: (linkId: string) => `/publicenrollment/admin/links/${linkId}`,
      ADMIN_LINK_TOGGLE: (linkId: string) => `/publicenrollment/admin/links/${linkId}/toggle`,
      ADMIN_LINK_REGENERATE_QR: (linkId: string) => `/publicenrollment/admin/links/${linkId}/regenerate-qr`,
    },
  },
};