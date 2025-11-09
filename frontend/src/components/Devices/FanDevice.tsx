/**
 * FanDevice Component - Visual representation of fan
 */

import React from 'react';
import type { FanSettings } from '../../types';

interface FanDeviceProps {
  settings: FanSettings;
}

const FanDevice: React.FC<FanDeviceProps> = ({ settings }) => {
  const { power, speed } = settings as FanSettings;

  const getAnimationDuration = (): string => {
    if (!power || speed === 0) return '0s';
    // Speed 100 = 1s, Speed 50 = 2s, Speed 25 = 3s
    const duration = 100 / speed;
    return `${duration}s`;
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Fan Blades */}
      <div
        className="relative w-48 h-48"
        style={{
          animation: power ? `spin ${getAnimationDuration()} linear infinite` : 'none',
        }}
      >
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 z-10" />

        {/* Blade 1 - Top */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ transformOrigin: '50% 96px' }}
        >
          <div className="w-20 h-24 rounded-t-full bg-gradient-to-b from-gray-500 to-gray-600" />
        </div>

        {/* Blade 2 - Right */}
        <div
          className="absolute top-1/2 right-0 transform -translate-y-1/2"
          style={{ transformOrigin: '-96px 50%' }}
        >
          <div className="w-24 h-20 rounded-r-full bg-gradient-to-l from-gray-500 to-gray-600" />
        </div>

        {/* Blade 3 - Bottom */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{ transformOrigin: '50% -96px' }}
        >
          <div className="w-20 h-24 rounded-b-full bg-gradient-to-t from-gray-500 to-gray-600" />
        </div>

        {/* Blade 4 - Left */}
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2"
          style={{ transformOrigin: '96px 50%' }}
        >
          <div className="w-24 h-20 rounded-l-full bg-gradient-to-r from-gray-500 to-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default FanDevice;