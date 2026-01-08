/**
 * Attendance service
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { AttendanceRecord, MarkAttendanceRequest } from '../types';

export const attendanceService = {
  /**
   * Mark attendance for a session (student only)
   */
  async markAttendance(data: MarkAttendanceRequest): Promise<{
    message: string;
    attendance: AttendanceRecord;
  }> {
    const response = await apiClient.post(API_ENDPOINTS.MARK_ATTENDANCE, data);
    return response.data;
  },

  /**
   * Get student's attendance history (student only)
   */
  async getMyHistory(): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<AttendanceRecord[]>(API_ENDPOINTS.MY_HISTORY);
    return response.data;
  },

  /**
   * Get attendance records for a specific session
   */
  async getAttendanceBySession(sessionId: number): Promise<{
    session_id: number;
    total_attendance: number;
    records: AttendanceRecord[];
  }> {
    const response = await apiClient.get(API_ENDPOINTS.BY_SESSION, {
      params: { session_id: sessionId },
    });
    return response.data;
  },
};
