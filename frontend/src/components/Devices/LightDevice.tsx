/**
 * LightDevice Component - Visual representation of light
 */

import React from 'react';
import type { LightSettings, ColorTemp } from '../../types';
import { COLOR_TEMP_CONFIG } from '../../utils/constants';

interface LightDeviceProps {
  settings: LightSettings;
}

const LightDevice: React.FC<LightDeviceProps> = ({ settings }) => {
  const { power, brightness, colorTemp } = settings as LightSettings;

  const getGlowClass = (): string => {
    if (!power) return '';
    switch (colorTemp) {
      case 'warm':
        return 'light-glow-warm';
      case 'neutral':
        return 'light-glow-neutral';
      case 'cool':
        return 'light-glow-cool';
      case 'pink':
        return 'light-glow-pink';
      default:
        return '';
    }
  };

  const getBulbColor = (): string => {
    if (!power) return '#4b5563'; // Gray when off
    return COLOR_TEMP_CONFIG[colorTemp as ColorTemp].color;
  };

  const getOpacity = (): number => {
    if (!power) return 0.5;
    return 0.5 + (brightness / 200); // Range from 0.5 to 1
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Light Holder/Base */}
      <div className="w-20 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-sm mb-1" />

      {/* Light Bulb */}
      <div className={`relative ${power ? getGlowClass() : ''}`}>
        <svg width="200" height="240" viewBox="0 0 200 240" fill="none">
          {/* Bulb Shape */}
          <ellipse
            cx="100"
            cy="120"
            rx="80"
            ry="100"
            fill={getBulbColor()}
            opacity={getOpacity()}
            className="transition-all duration-300"
          />
          
          {/* Filament (visible when on) */}
          {power && (
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="160"
              stroke="white"
              strokeWidth="4"
              opacity={brightness / 100}
              className="transition-opacity duration-300"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default LightDevice;