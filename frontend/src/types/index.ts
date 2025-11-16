/**
 * TypeScript Type Definitions
 */

// Device Types
export type DeviceType = 'light' | 'fan';

// Color Temperature Types for Light
export type ColorTemp = 'warm' | 'neutral' | 'cool' | 'pink';

// Light Settings
export interface LightSettings {
  power: boolean;
  brightness: number;
  colorTemp: ColorTemp;
}

// Fan Settings
export interface FanSettings {
  power: boolean;
  speed: number;
}

// Device Settings Union Type
export type DeviceSettings = LightSettings | FanSettings;

// Position
export interface Position {
  x: number;
  y: number;
}

// Device
export interface Device {
  id: number;
  type: DeviceType;
  settings: DeviceSettings;
  position_x: number;
  position_y: number;
  created_at?: string;
  updated_at?: string;
}

// Preset
export interface Preset {
  id: number;
  name: string;
  device_type: DeviceType;
  device_settings: DeviceSettings;
  position_x: number;
  position_y: number;
  created_at: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string | string[]>;
  debug?: any;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  message: string;
  type: NotificationType;
}

// Drag & Drop Types
export interface DragItem {
  type: string;
  deviceType?: DeviceType;
  preset?: Preset;
}

// Color Temperature Config
export interface ColorTempConfig {
  label: string;
  color: string;
  bgClass: string;
  className: string;
}

// Device Context State
export interface DeviceContextState {
  // State
  currentDevice: Device | null;
  presets: Preset[];
  loading: boolean;
  notification: Notification | null;
  loadedPresetSettings: DeviceSettings | null;
  isModalOpen: boolean;
  isPresetUnchanged: boolean;

  // Device Methods
  addDevice: (
    type: DeviceType,
    position?: Position
  ) => Promise<Device | undefined>;
  updateDevice: (updates: Partial<DeviceSettings>) => Promise<void>;
  updateDevicePosition: (position: Position) => Promise<void>;
  removeDevice: () => Promise<void>;

  // Preset Methods
  saveAsPreset: (name: string) => Promise<Preset | undefined>;
  loadPreset: (preset: Preset) => Promise<void>;
  deletePreset: (presetId: number) => Promise<void>;

  // Utility Methods
  showNotification: (message: string, type?: NotificationType) => void;
  loadCurrentDevice: () => Promise<void>;
  loadPresets: () => Promise<void>;

  // Modal Methods
  openModal: () => void;
  closeModal: () => void;
}
