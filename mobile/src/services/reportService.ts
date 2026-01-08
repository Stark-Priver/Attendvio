/**
 * Reports service
 */
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { SessionReport, DashboardStats } from '../types';

export const reportService = {
  /**
   * Get detailed report for a session (teacher only)
   */
  async getSessionReport(sessionId: number): Promise<SessionReport> {
    const response = await apiClient.get<SessionReport>(
      API_ENDPOINTS.SESSION_REPORT(sessionId)
    );
    return response.data;
  },

  /**
   * Get teacher dashboard statistics
   */
  async getTeacherDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.TEACHER_DASHBOARD);
    return response.data;
  },

  /**
   * Get student dashboard statistics
   */
  async getStudentDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.STUDENT_DASHBOARD);
    return response.data;
  },

  /**
   * Get CSV export URL for a session
   */
  getExportURL(sessionId: number): string {
    return API_ENDPOINTS.EXPORT_CSV(sessionId);
  },
};
