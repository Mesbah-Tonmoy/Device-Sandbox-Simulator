import type {
  ColorTemp,
  ColorTempConfig,
  LightSettings,
  FanSettings,
  Position,
} from '../types';

// API Configuration
export const API_BASE_URL =
  'http://localhost/device-sandbox-simulator/backend/api';

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
  },
  neutral: {
    label: 'Neutral',
    color: '#f0f8ff',
    bgClass: 'bg-[#f0f8ff]',
  },
  cool: {
    label: 'Cool',
    color: '#87ceeb',
    bgClass: 'bg-[#87ceeb]',
  },
  pink: {
    label: 'Pink',
    color: '#ffb6c1',
    bgClass: 'bg-[#ffb6c1]',
  },
};

// Default Device Settings
export const DEFAULT_DEVICE_SETTINGS: {
  light: LightSettings;
  fan: FanSettings;
} = {
  light: {
    power: true,
    brightness: 70,
    colorTemp: 'warm',
  },
  fan: {
    power: true,
    speed: 50,
  },
};

// Canvas Configuration
export const CANVAS_CONFIG: {
  DEFAULT_POSITION: Position;
  MIN_POSITION: number;
  MAX_POSITION: number;
} = {
  DEFAULT_POSITION: {
    x: 640,
    y: 350,
  },
  MIN_POSITION: 0,
  MAX_POSITION: 10000,
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
