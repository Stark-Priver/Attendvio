/**
 * Session service for managing attendance sessions
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { AttendanceSession } from '../types';

export const sessionService = {
  /**
   * Get all sessions (filtered by role on backend)
   */
  async getSessions(): Promise<AttendanceSession[]> {
    const response = await apiClient.get<AttendanceSession[]>(API_ENDPOINTS.SESSIONS);
    return response.data;
  },

  /**
   * Get active sessions only
   */
  async getActiveSessions(): Promise<AttendanceSession[]> {
    const response = await apiClient.get<AttendanceSession[]>(API_ENDPOINTS.ACTIVE_SESSIONS);
    return response.data;
  },

  /**
   * Get session by ID
   */
  async getSession(id: number): Promise<AttendanceSession> {
    const response = await apiClient.get<AttendanceSession>(`${API_ENDPOINTS.SESSIONS}${id}/`);
    return response.data;
  },

  /**
   * Create new session (teacher only)
   */
  async createSession(data: {
    subject_name: string;
    latitude: number;
    longitude: number;
    radius: number;
    start_time: string;
    end_time: string;
  }): Promise<AttendanceSession> {
    const response = await apiClient.post<AttendanceSession>(API_ENDPOINTS.SESSIONS, data);
    return response.data;
  },

  /**
   * Update session (teacher only)
   */
  async updateSession(id: number, data: Partial<AttendanceSession>): Promise<AttendanceSession> {
    const response = await apiClient.patch<AttendanceSession>(
      `${API_ENDPOINTS.SESSIONS}${id}/`,
      data
    );
    return response.data;
  },

  /**
   * End session manually (teacher only)
   */
  async endSession(id: number): Promise<{ message: string; session: AttendanceSession }> {
    const response = await apiClient.post(API_ENDPOINTS.END_SESSION(id));
    return response.data;
  },

  /**
   * Delete session (teacher only)
   */
  async deleteSession(id: number): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.SESSIONS}${id}/`);
  },
};
