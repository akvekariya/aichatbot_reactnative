import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async config => {
        try {
          const token = await AsyncStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from storage:', error);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async error => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.headers?.Authorization
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshResponse = await this.api.post(
              API_CONFIG.ENDPOINTS.AUTH.REFRESH,
            );
            const newToken = refreshResponse.data.data.token;

            // Save new token
            await AsyncStorage.setItem(STORAGE_KEYS.JWT_TOKEN, newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await AsyncStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
            // You might want to dispatch a logout action here
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Generic HTTP methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.get(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.put(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.delete(url, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.patch(url, data, config);
  }

  // Set auth token manually
  setAuthToken(token: string) {
    this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken() {
    delete this.api.defaults.headers.common.Authorization;
  }

  // Get base URL
  getBaseURL(): string {
    return API_CONFIG.BASE_URL;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
