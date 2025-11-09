/**
 * Device Context - Global State Management (TypeScript)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { deviceAPI, presetAPI, handleApiError } from '../services/api';
import type { 
  Device, 
  Preset, 
  DeviceType, 
  DeviceSettings, 
  Position,
  Notification,
  NotificationType,
  DeviceContextState,
} from '../types';
import { 
  DEFAULT_DEVICE_SETTINGS, 
  CANVAS_CONFIG,
  NOTIFICATION_TYPES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../utils/constants';

const DeviceContext = createContext<DeviceContextState | undefined>(undefined);

export const useDevice = (): DeviceContextState => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
};

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = NOTIFICATION_TYPES.SUCCESS) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const loadCurrentDevice = useCallback(async () => {
    try {
      const response = await deviceAPI.getCurrent();
      if (response.success && response.data) {
        setCurrentDevice(response.data);
      } else {
        setCurrentDevice(null);
      }
    } catch (error) {
      console.error('Failed to load device:', error);
    }
  }, []);

  const loadPresets = useCallback(async () => {
    try {
      const response = await presetAPI.getAll();
      if (response.success) {
        setPresets(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
      showNotification(ERROR_MESSAGES.LOAD_FAILED, NOTIFICATION_TYPES.ERROR);
    }
  }, [showNotification]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadCurrentDevice(), loadPresets()]);
      setLoading(false);
    };
    initialize();
  }, [loadCurrentDevice, loadPresets]);

  const addDevice = useCallback(async (
    type: DeviceType, 
    position: Position = CANVAS_CONFIG.DEFAULT_POSITION
  ): Promise<Device | undefined> => {
    try {
      const deviceData = {
        type,
        settings: DEFAULT_DEVICE_SETTINGS[type],
        position_x: position.x,
        position_y: position.y,
      };

      const response = await deviceAPI.save(deviceData);
      if (response.success && response.data) {
        setCurrentDevice(response.data);
        return response.data;
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      throw error;
    }
  }, [showNotification]);

  const updateDevice = useCallback(async (updates: Partial<DeviceSettings>): Promise<void> => {
    if (!currentDevice) return;

    try {
      const updatedSettings = { ...currentDevice.settings, ...updates };
      const deviceData = {
        type: currentDevice.type,
        settings: updatedSettings,
        position_x: currentDevice.position_x,
        position_y: currentDevice.position_y,
      };

      const response = await deviceAPI.save(deviceData);
      if (response.success && response.data) {
        setCurrentDevice(response.data);
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  }, [currentDevice, showNotification]);

  const updateDevicePosition = useCallback(async (position: Position): Promise<void> => {
    if (!currentDevice) return;

    try {
      const deviceData = {
        type: currentDevice.type,
        settings: currentDevice.settings,
        position_x: position.x,
        position_y: position.y,
      };

      const response = await deviceAPI.save(deviceData);
      if (response.success && response.data) {
        setCurrentDevice(response.data);
      }
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  }, [currentDevice]);

  const removeDevice = useCallback(async (): Promise<void> => {
    try {
      const response = await deviceAPI.delete();
      if (response.success) {
        setCurrentDevice(null);
        showNotification(SUCCESS_MESSAGES.DEVICE_DELETED, NOTIFICATION_TYPES.SUCCESS);
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  }, [showNotification]);

  const saveAsPreset = useCallback(async (name: string): Promise<Preset | undefined> => {
    if (!currentDevice) {
      showNotification('No device to save', NOTIFICATION_TYPES.ERROR);
      return;
    }

    try {
      const presetData = {
        name,
        device_type: currentDevice.type,
        device_settings: currentDevice.settings,
        position_x: currentDevice.position_x,
        position_y: currentDevice.position_y,
      };

      const response = await presetAPI.save(presetData);
      if (response.success && response.data) {
        await loadPresets();
        showNotification(SUCCESS_MESSAGES.PRESET_SAVED, NOTIFICATION_TYPES.SUCCESS);
        return response.data;
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      throw error;
    }
  }, [currentDevice, loadPresets, showNotification]);

  const loadPreset = useCallback(async (preset: Preset): Promise<void> => {
    try {
      const deviceData = {
        type: preset.device_type,
        settings: preset.device_settings,
        position_x: preset.position_x,
        position_y: preset.position_y,
      };

      const response = await deviceAPI.save(deviceData);
      if (response.success && response.data) {
        setCurrentDevice(response.data);
        showNotification(SUCCESS_MESSAGES.PRESET_LOADED, NOTIFICATION_TYPES.SUCCESS);
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  }, [showNotification]);

  const deletePreset = useCallback(async (presetId: number): Promise<void> => {
    try {
      const response = await presetAPI.delete(presetId);
      if (response.success) {
        await loadPresets();
        showNotification(SUCCESS_MESSAGES.PRESET_DELETED, NOTIFICATION_TYPES.SUCCESS);
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  }, [loadPresets, showNotification]);

  const value: DeviceContextState = {
    currentDevice,
    presets,
    loading,
    notification,
    addDevice,
    updateDevice,
    updateDevicePosition,
    removeDevice,
    saveAsPreset,
    loadPreset,
    deletePreset,
    showNotification,
    loadCurrentDevice,
    loadPresets,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export default DeviceContext;