import type {
  ColorTemp,
  ColorTempConfig,
  LightSettings,
  FanSettings,
} from '../types';

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  DEVICE_SAVE: `${API_BASE_URL}/devices/save.php`,
  DEVICE_GET: `${API_BASE_URL}/devices/get.php`,
  DEVICE_DELETE: `${API_BASE_URL}/devices/delete.php`,

  PRESET_SAVE: `${API_BASE_URL}/presets/save.php`,
  PRESET_LIST: `${API_BASE_URL}/presets/list.php`,
  PRESET_GET: `${API_BASE_URL}/presets/get.php`,
  PRESET_DELETE: `${API_BASE_URL}/presets/delete.php`,
} as const;

// Device Types
export const DEVICE_TYPES = {
  LIGHT: 'light' as const,
  FAN: 'fan' as const,
};

// Drag & Drop Item Types
export const DND_TYPES = {
  DEVICE: 'device',
  PRESET: 'preset',
} as const;

// Color Temperature Options
export const COLOR_TEMPS: Record<string, ColorTemp> = {
  WARM: 'warm',
  NEUTRAL: 'neutral',
  COOL: 'cool',
  PINK: 'pink',
};

// Color Temperature Configuration
export const COLOR_TEMP_CONFIG: Record<ColorTemp, ColorTempConfig> = {
  warm: {
    label: 'Warm',
    color: '#ffe5b4',
    bgClass: 'bg-[#ffe5b4]',
    className:
      'light-glow warm bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#FFE5B4_0%,rgba(255,229,180,0.867)_50%,rgba(255,229,180,0.6)_100%)] shadow-[inset_0_0_20px_#FFE5B466,0_0_60px_#FFE5B499]',
  },
  neutral: {
    label: 'Neutral',
    color: '#f0f8ff',
    bgClass: 'bg-[#f0f8ff]',
    className:
      'light-glow neutral bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#F0F8FF_0%,rgba(240,248,255,0.867)_50%,rgba(240,248,255,0.6)_100%)] shadow-[inset_0_0_20px_#F0F8FF66,0_0_60px_#F0F8FF99]',
  },
  cool: {
    label: 'Cool',
    color: '#87ceeb',
    bgClass: 'bg-[#87ceeb]',
    className:
      'light-glow cool bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#87CEEB_0%,rgba(135,206,235,0.867)_50%,rgba(135,206,235,0.6)_100%)] shadow-[inset_0_0_20px_#87CEEB66,0_0_60px_#87CEEB99]',
  },
  pink: {
    label: 'Pink',
    color: '#ffb6c1',
    bgClass: 'bg-[#ffb6c1]',
    className:
      'light-glow pink bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#FFB6C1_0%,rgba(255,182,193,0.867)_50%,rgba(255,182,193,0.6)_100%)] shadow-[inset_0_0_20px_#FFB6C166,0_0_60px_#FFB6C199]',
  },
};

// Default Device Settings
export const DEFAULT_DEVICE_SETTINGS: {
  light: LightSettings;
  fan: FanSettings;
} = {
  light: {
    power: false,
    brightness: 0,
    colorTemp: 'warm',
  },
  fan: {
    power: false,
    speed: 50,
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  INFO: 'info' as const,
  WARNING: 'warning' as const,
};

// Animation Durations
export const ANIMATION = {
  FAN_SPEED_SLOW: 3,
  FAN_SPEED_MEDIUM: 2,
  FAN_SPEED_FAST: 1,
  NOTIFICATION_DURATION: 3000,
} as const;

// Validation Rules
export const VALIDATION = {
  BRIGHTNESS: {
    MIN: 0,
    MAX: 100,
  },
  SPEED: {
    MIN: 0,
    MAX: 100,
  },
  PRESET_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SAVE_FAILED: 'Failed to save device. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  PRESET_NAME_REQUIRED: 'Please enter a preset name.',
  PRESET_NAME_TOO_LONG: `Preset name must be less than ${VALIDATION.PRESET_NAME.MAX_LENGTH} characters.`,
  INVALID_DATA: 'Invalid data format.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DEVICE_SAVED: 'Device saved successfully!',
  PRESET_SAVED: 'Preset saved successfully!',
  PRESET_LOADED: 'Preset loaded successfully!',
  DEVICE_DELETED: 'Device removed from canvas.',
  PRESET_DELETED: 'Preset deleted successfully!',
} as const;
