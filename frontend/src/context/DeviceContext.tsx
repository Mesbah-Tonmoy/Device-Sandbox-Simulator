/**
 * Device Context - Global State Management (TypeScript)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { deviceAPI, presetAPI, handleApiError } from '../services/api';
import type {
  Device,
  Preset,
  DeviceType,
  DeviceSettings,
  Notification,
  NotificationType,
  DeviceContextState,
} from '../types';
import {
  DEFAULT_DEVICE_SETTINGS,
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
  const [loadedPresetSettings, setLoadedPresetSettings] =
    useState<DeviceSettings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showNotification = useCallback(
    (message: string, type: NotificationType = NOTIFICATION_TYPES.SUCCESS) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

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

  // Initialize data on mount
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadCurrentDevice(), loadPresets()]);
      setLoading(false);
    };
    initialize();
  }, [loadCurrentDevice, loadPresets]);

  const addDevice = useCallback(
    async (type: DeviceType): Promise<Device | undefined> => {
      try {
        const deviceData = {
          type,
          settings: DEFAULT_DEVICE_SETTINGS[type],
        };

        const response = await deviceAPI.save(deviceData);
        if (response.success && response.data) {
          setCurrentDevice(response.data);
          setLoadedPresetSettings(null); // Clear preset tracking
          return response.data;
        }
      } catch (error) {
        const errorMsg = handleApiError(error);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
        throw error;
      }
    },
    [showNotification]
  );

  const updateDevice = useCallback(
    async (updates: Partial<DeviceSettings>): Promise<void> => {
      if (!currentDevice) return;

      try {
        const updatedSettings = { ...currentDevice.settings, ...updates };
        const deviceData = {
          type: currentDevice.type,
          settings: updatedSettings,
        };

        const response = await deviceAPI.save(deviceData);
        if (response.success && response.data) {
          setCurrentDevice(response.data);
        }
      } catch (error) {
        const errorMsg = handleApiError(error);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      }
    },
    [currentDevice, showNotification]
  );

  const removeDevice = useCallback(async (): Promise<void> => {
    try {
      const response = await deviceAPI.delete();
      if (response.success) {
        setCurrentDevice(null);
        setLoadedPresetSettings(null); // Clear preset tracking
        showNotification(
          SUCCESS_MESSAGES.DEVICE_DELETED,
          NOTIFICATION_TYPES.SUCCESS
        );
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  }, [showNotification]);

  const saveAsPreset = useCallback(
    async (name: string): Promise<Preset | undefined> => {
      if (!currentDevice) {
        showNotification('No device to save', NOTIFICATION_TYPES.ERROR);
        return;
      }

      try {
        const presetData = {
          name,
          device_type: currentDevice.type,
          device_settings: currentDevice.settings,
        };

        const response = await presetAPI.save(presetData);
        if (response.success && response.data) {
          await loadPresets();
          showNotification(
            SUCCESS_MESSAGES.PRESET_SAVED,
            NOTIFICATION_TYPES.SUCCESS
          );
          return response.data;
        }
      } catch (error) {
        const errorMsg = handleApiError(error);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
        throw error;
      }
    },
    [currentDevice, loadPresets, showNotification]
  );

  const loadPreset = useCallback(
    async (preset: Preset): Promise<void> => {
      try {
        const deviceData = {
          type: preset.device_type,
          settings: preset.device_settings,
        };

        const response = await deviceAPI.save(deviceData);
        if (response.success && response.data) {
          setCurrentDevice(response.data);
          setLoadedPresetSettings(preset.device_settings); // Track loaded preset
          showNotification(
            SUCCESS_MESSAGES.PRESET_LOADED,
            NOTIFICATION_TYPES.SUCCESS
          );
        }
      } catch (error) {
        const errorMsg = handleApiError(error);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      }
    },
    [showNotification]
  );

  const deletePreset = useCallback(
    async (presetId: number): Promise<void> => {
      try {
        const response = await presetAPI.delete(presetId);
        if (response.success) {
          await loadPresets();
          showNotification(
            SUCCESS_MESSAGES.PRESET_DELETED,
            NOTIFICATION_TYPES.SUCCESS
          );
        }
      } catch (error) {
        const errorMsg = handleApiError(error);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      }
    },
    [loadPresets, showNotification]
  );

  // Modal control methods
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Check if current device matches loaded preset (for save button state)
  const isPresetUnchanged = Boolean(
    currentDevice &&
      loadedPresetSettings &&
      JSON.stringify(currentDevice.settings) ===
        JSON.stringify(loadedPresetSettings)
  );

  const value: DeviceContextState = {
    currentDevice,
    presets,
    loading,
    notification,
    loadedPresetSettings,
    isModalOpen,
    isPresetUnchanged,
    addDevice,
    updateDevice,
    removeDevice,
    saveAsPreset,
    loadPreset,
    deletePreset,
    showNotification,
    loadCurrentDevice,
    loadPresets,
    openModal,
    closeModal,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export default DeviceContext;
