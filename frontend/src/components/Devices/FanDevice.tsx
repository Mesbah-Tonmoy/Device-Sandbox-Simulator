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
    <div className="relative flex items-center justify-center">
      {/* Fan Blades */}
      <div
        className="relative lg:w-80 lg:h-80 w-60 h-60"
        style={{
          animation: power
            ? `spin ${getAnimationDuration()} linear infinite`
            : 'none',
        }}
      >
        {/* Center Circle */}
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-20 lg:h-20 w-16 h-16 rounded-full bg-[linear-gradient(135deg,#4A5565_0%,#1E2939_100%)] border-4 border-[#364153] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] z-9">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-14 lg:h-14 w-10 h-10 rounded-full bg-[linear-gradient(135deg,#364153_0%,#101828_100%)] z-10"></div>
        </div>

        {/* Blade 1 - Top */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ transformOrigin: '50% 96px' }}
        >
          <div className="lg:w-[54px] lg:h-[140px] w-[40px] h-[100px] rounded-t-full bg-[linear-gradient(360deg,#4a5568_0%,#2d3748_30%,#1a202c_70%,#0f1419_100%)] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Blade 2 - Right */}
        <div
          className="absolute top-1/2 right-0 transform -translate-y-1/2"
          style={{ transformOrigin: '-96px 50%' }}
        >
          <div className="lg:w-[140px] lg:h-[54px] w-[100px] h-[40px] rounded-r-full bg-[linear-gradient(90deg,#4a5568_0%,#2d3748_30%,#1a202c_70%,#0f1419_100%)] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Blade 3 - Bottom */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{ transformOrigin: '50% -96px' }}
        >
          <div className="lg:w-[54px] lg:h-[140px] w-[40px] h-[100px] rounded-b-full bg-[linear-gradient(180deg,#4a5568_0%,#2d3748_30%,#1a202c_70%,#0f1419_100%)] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Blade 4 - Left */}
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2"
          style={{ transformOrigin: '96px 50%' }}
        >
          <div className="lg:w-[140px] lg:h-[54px] w-[100px] h-[40px] rounded-l-full bg-[linear-gradient(270deg,#4a5568_0%,#2d3748_30%,#1a202c_70%,#0f1419_100%)] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.1)]" />
        </div>
      </div>
    </div>
  );
};

export default FanDevice;
