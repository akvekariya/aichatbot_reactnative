import { AxiosResponse } from 'axios';
import { API_CONFIG } from '../constants';
import { ApiResponse, GoogleAuthResponse, Profile, User } from '../types';
import { apiService } from './apiService';

class AuthService {
  // Google OAuth login
  async loginWithGoogle(
    idToken: string,
  ): Promise<AxiosResponse<GoogleAuthResponse>> {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.GOOGLE, { idToken });
  }

  // Get current user information
  async getCurrentUser(): Promise<AxiosResponse<ApiResponse<User>>> {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.ME);
  }

  // Refresh JWT token
  async refreshToken(): Promise<
    AxiosResponse<ApiResponse<{ token: string; expiresIn: string }>>
  > {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  }

  // Create user profile
  async createProfile(profileData: {
    name: string;
    age: number;
    additionalInfo?: string;
  }): Promise<AxiosResponse<ApiResponse<Profile>>> {
    return apiService.post(API_CONFIG.ENDPOINTS.PROFILE.CREATE, profileData);
  }

  // Get user profile
  async getProfile(): Promise<AxiosResponse<ApiResponse<Profile>>> {
    return apiService.get(API_CONFIG.ENDPOINTS.PROFILE.GET);
  }

  // Update user profile
  async updateProfile(profileData: {
    name: string;
    age: number;
    additionalInfo?: string;
  }): Promise<AxiosResponse<ApiResponse<Profile>>> {
    return apiService.put(API_CONFIG.ENDPOINTS.PROFILE.UPDATE, profileData);
  }

  // Delete user profile
  async deleteProfile(): Promise<
    AxiosResponse<ApiResponse<{ deleted: boolean; timestamp: string }>>
  > {
    return apiService.delete(API_CONFIG.ENDPOINTS.PROFILE.DELETE);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
