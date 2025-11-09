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
    if (!power) return '#4a5568'; // Dark gray when off
    return COLOR_TEMP_CONFIG[colorTemp as ColorTemp].color;
  };

  const getOpacity = (): number => {
    if (!power) return 1;
    return 0.85 + brightness / 667; // Range from 0.85 to 1
  };

  const getFilamentOpacity = (): number => {
    if (!power) return 0;
    return 0.5 + brightness / 200; // Range from 0.5 to 1
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Light Holder/Mount - Improved design */}
      <div className="relative mb-2">
        {/* Top cap */}
        <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-16 h-3 rounded-t-[6px] m-auto" />

        {/* Holder ridges (3 lines) */}
        <div>
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
        </div>
      </div>

      {/* Light Bulb with Glow */}
      <div
        className={`relative transition-all duration-300 ${power ? getGlowClass() : ''}`}
      >
        <div className="w-[128px] h-[160px] rounded-full pt-8 pr-12 pl-8 bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#4A5568_0%,#2D3748_50%,#1A202C_100%)] shadow-[inset_0_0_20px_#00000080]">
          <div className="w-12 h-16 opacity-40 rounded-full bg-linear-to-br from-white/80 to-transparent blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LightDevice;
