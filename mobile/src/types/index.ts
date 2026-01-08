/**
 * TypeScript type definitions for Attendvio
 */

export type UserRole = 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  student_id?: string;
  department?: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AttendanceSession {
  id: number;
  teacher: number;
  teacher_name: string;
  subject_name: string;
  latitude: string;
  longitude: string;
  radius: number;
  start_time: string;
  end_time: string;
  status: 'ACTIVE' | 'ENDED' | 'SCHEDULED';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  session: number;
  session_name: string;
  student: number;
  student_name: string;
  student_id: string;
  marked_latitude: string;
  marked_longitude: string;
  distance_from_center: number;
  marked_at: string;
  is_verified: boolean;
  notes: string;
}

export interface MarkAttendanceRequest {
  session_id: number;
  latitude: number;
  longitude: number;
}

export interface SessionReport {
  session: {
    id: number;
    subject_name: string;
    start_time: string;
    end_time: string;
    status: string;
  };
  statistics: {
    total_attendance: number;
    verified_attendance: number;
    unverified_attendance: number;
  };
  attendees: Array<{
    student_id: string;
    student_name: string;
    email: string;
    department: string;
    marked_at: string;
    distance: number;
    is_verified: boolean;
  }>;
}

export interface DashboardStats {
  statistics: {
    total_sessions?: number;
    active_sessions?: number;
    ended_sessions?: number;
    total_attendance: number;
  };
  recent_sessions?: Array<{
    id: number;
    subject_name: string;
    start_time: string;
    end_time: string;
    status: string;
  }>;
  recent_attendance?: Array<{
    session__subject_name: string;
    session__teacher__first_name: string;
    session__teacher__last_name: string;
    marked_at: string;
    distance_from_center: number;
  }>;
}
