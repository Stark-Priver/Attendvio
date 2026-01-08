/**
 * Authentication service
 */
import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '../config/api';
import { LoginResponse, User } from '../types';

export const authService = {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    // Store tokens and user data
    await SecureStore.setItemAsync('accessToken', response.data.tokens.access);
    await SecureStore.setItemAsync('refreshToken', response.data.tokens.refresh);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));

    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    role: 'TEACHER' | 'STUDENT';
    student_id?: string;
    department?: string;
  }): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.REGISTER, data);

    // Store tokens and user data
    await SecureStore.setItemAsync('accessToken', response.data.tokens.access);
    await SecureStore.setItemAsync('refreshToken', response.data.tokens.refresh);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));

    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.LOGOUT, { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    const userJson = await SecureStore.getItemAsync('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('accessToken');
    return !!token;
  },
};
