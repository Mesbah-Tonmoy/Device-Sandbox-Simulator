/**
 * FanControls Component - Control panel for fan device
 */

import React, { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import type { FanSettings } from '../../types';

const FanControls: React.FC = () => {
  const { currentDevice, updateDevice } = useDevice();
  const sliderRef = useRef<HTMLInputElement>(null);

  if (!currentDevice || currentDevice.type !== 'fan') return null;

  const settings = currentDevice.settings as FanSettings;
  const { power, speed } = settings;

  // Update slider gradient
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--value', `${speed}%`);
    }
  }, [speed]);

  const handlePowerToggle = () => {
    updateDevice({ power: !power });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value);
    updateDevice({ speed: newSpeed });
  };

  return (
    <div className="bg-[var(--color-dark-secondary)] p-6 rounded-xl border border-gray-700 space-y-5">
      {/* Power Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-white text-sm font-medium">Power</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="fan-power"
            checked={power}
            onChange={handlePowerToggle}
          />
          <label htmlFor="fan-power" />
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white text-sm font-medium">Speed</label>
          <span className="text-gray-400 text-sm font-medium">{speed}%</span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FanControls;