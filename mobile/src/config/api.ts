/**
 * API configuration
 */

// Change this to your backend URL
export const API_BASE_URL = 'http://10.0.2.2:8000/api'; // For Android emulator
// export const API_BASE_URL = 'http://localhost:8000/api'; // For iOS simulator
// export const API_BASE_URL = 'https://your-production-url.com/api'; // For production

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  PROFILE: '/auth/profile/',
  LOGOUT: '/auth/logout/',
  TOKEN_REFRESH: '/token/refresh/',
  
  // Sessions
  SESSIONS: '/sessions/',
  ACTIVE_SESSIONS: '/sessions/active/',
  END_SESSION: (id: number) => `/sessions/${id}/end_session/`,
  
  // Attendance
  ATTENDANCE: '/attendance/',
  MARK_ATTENDANCE: '/attendance/mark/',
  MY_HISTORY: '/attendance/my_history/',
  BY_SESSION: '/attendance/by_session/',
  
  // Reports
  SESSION_REPORT: (id: number) => `/reports/session/${id}/`,
  EXPORT_CSV: (id: number) => `/reports/session/${id}/export/`,
  TEACHER_DASHBOARD: '/reports/teacher/dashboard/',
  STUDENT_DASHBOARD: '/reports/student/dashboard/',
};
