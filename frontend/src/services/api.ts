/**
 * API Service Layer (TypeScript)
 */

import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants';
import type { Device, Preset, ApiResponse } from '../types';

// Create axios instance
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ 
        success: false, 
        message: ERROR_MESSAGES.NETWORK_ERROR 
      });
    } else {
      return Promise.reject({ 
        success: false, 
        message: error.message 
      });
    }
  }
);

/**
 * Device API Methods
 */
export const deviceAPI = {
  getCurrent: async (): Promise<ApiResponse<Device>> => {
    try {
      const response = await apiClient.get<ApiResponse<Device>>(API_ENDPOINTS.DEVICE_GET);
      return response.data;
    } catch (error) {
      console.error('Get device error:', error);
      throw error;
    }
  },

  save: async (deviceData: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Device>> => {
    try {
      const response = await apiClient.post<ApiResponse<Device>>(
        API_ENDPOINTS.DEVICE_SAVE, 
        deviceData
      );
      return response.data;
    } catch (error) {
      console.error('Save device error:', error);
      throw error;
    }
  },

  delete: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse>(API_ENDPOINTS.DEVICE_DELETE);
      return response.data;
    } catch (error) {
      console.error('Delete device error:', error);
      throw error;
    }
  },
};

/**
 * Preset API Methods
 */
export const presetAPI = {
  getAll: async (filters?: { type?: string; search?: string }): Promise<ApiResponse<Preset[]>> => {
    try {
      const params = new URLSearchParams(filters as Record<string, string>).toString();
      const url = params 
        ? `${API_ENDPOINTS.PRESET_LIST}?${params}` 
        : API_ENDPOINTS.PRESET_LIST;
      
      const response = await apiClient.get<ApiResponse<Preset[]>>(url);
      return response.data;
    } catch (error) {
      console.error('Get presets error:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<ApiResponse<Preset>> => {
    try {
      const response = await apiClient.get<ApiResponse<Preset>>(
        `${API_ENDPOINTS.PRESET_GET}?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Get preset error:', error);
      throw error;
    }
  },

  save: async (presetData: Omit<Preset, 'id' | 'created_at'>): Promise<ApiResponse<Preset>> => {
    try {
      const response = await apiClient.post<ApiResponse<Preset>>(
        API_ENDPOINTS.PRESET_SAVE, 
        presetData
      );
      return response.data;
    } catch (error) {
      console.error('Save preset error:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${API_ENDPOINTS.PRESET_DELETE}?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Delete preset error:', error);
      throw error;
    }
  },
};

/**
 * Handle API Errors
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (error?.errors) {
    const firstError = Object.values(error.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  return ERROR_MESSAGES.NETWORK_ERROR;
};

export default {
  device: deviceAPI,
  preset: presetAPI,
  handleApiError,
};