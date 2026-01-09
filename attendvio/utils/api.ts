/**
 * API client for Attendvio backend
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - adjust for your environment
const BASE_URL = 'http://localhost:8000/api';

// Storage keys
const TOKEN_KEY = '@attendvio_access_token';
const REFRESH_KEY = '@attendvio_refresh_token';
const USER_KEY = '@attendvio_user';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        await AsyncStorage.setItem(TOKEN_KEY, access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, logout user
        await clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth methods
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    role: 'TEACHER' | 'STUDENT';
    student_id?: string;
    department?: string;
  }) => {
    const response = await api.post('/auth/register/', data);
    await saveAuth(response.data.tokens, response.data.user);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    await saveAuth(response.data.tokens, response.data.user);
    return response.data;
  },

  logout: async () => {
    await clearAuth();
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Session methods (Teacher only)
export const sessionAPI = {
  createSession: async (data: {
    subject_name: string;
    latitude: number;
    longitude: number;
    radius: number;
    start_time: string;
    end_time: string;
  }) => {
    const response = await api.post('/sessions/', data);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/sessions/');
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await api.get('/sessions/active/');
    return response.data;
  },

  endSession: async (id: number) => {
    const response = await api.post(`/sessions/${id}/end_session/`);
    return response.data;
  },
};

// Attendance methods (Student only)
export const attendanceAPI = {
  markAttendance: async (data: {
    session_id: number;
    latitude: number;
    longitude: number;
  }) => {
    const response = await api.post('/attendance/mark/', data);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/my/');
    return response.data;
  },
};

// Storage helpers
const saveAuth = async (tokens: { access: string; refresh: string }, user: any) => {
  await AsyncStorage.setItem(TOKEN_KEY, tokens.access);
  await AsyncStorage.setItem(REFRESH_KEY, tokens.refresh);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
};

export default api;
