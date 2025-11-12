import React from 'react';
import type { LightSettings, ColorTemp } from '../../types';
import { COLOR_TEMP_CONFIG } from '../../utils/constants';

interface LightDeviceProps {
  settings: LightSettings;
}

const LightDevice: React.FC<LightDeviceProps> = ({ settings }) => {
  const { power, brightness, colorTemp } = settings as LightSettings;

  const getBulbColor = (): string => {
    if (!power)
      return 'bg-[radial-gradient(112.05%_89.64%_at_30%_30%,#4A5568_0%,#2D3748_50%,#1A202C_100%)] shadow-[inset_0_0_20px_#00000080]'; // Dark gray when off
    return COLOR_TEMP_CONFIG[colorTemp as ColorTemp].className;
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Light Holder/Mount */}
      <div className="relative mb-2">
        {/* Top cap */}
        <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-16 h-3 rounded-t-[6px] m-auto" />

        {/* Holder ridges */}
        <div>
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
          <div className="bg-linear-to-b from-[#4A5565] to-[#364153] w-20 h-1 rounded-t-[6px]" />
        </div>
      </div>

      {/* Light Bulb with Glow */}
      <div className={`relative transition-all duration-300`}>
        <div
          className={`w-[128px] h-[160px] rounded-full pt-8 pr-12 pl-8 ${getBulbColor()}`}
          style={
            {
              '--brightness': `${Math.min((brightness / 100) * 0.6, 0.6)}`,
            } as React.CSSProperties
          }
        >
          <div className="w-12 h-16 opacity-40 rounded-full bg-linear-to-br from-white/80 to-transparent blur-lg"></div>
          <div
            className={`filament absolute top-12 left-[62px] w-1 h-16 rounded-full ${!power ? 'hidden' : ''}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LightDevice;
