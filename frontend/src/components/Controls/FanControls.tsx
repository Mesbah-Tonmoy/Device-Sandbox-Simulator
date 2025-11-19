/**
 * FanControls Component - Control panel for fan device
 */

import React, { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import type { FanSettings } from '../../types';
import { VALIDATION } from '../../utils/constants';

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
    const value = parseInt(e.target.value);

    // Input constraint: Ensure value is within valid range
    if (isNaN(value)) return;

    const constrainedValue = Math.max(
      VALIDATION.SPEED.MIN,
      Math.min(VALIDATION.SPEED.MAX, value)
    );

    updateDevice({ speed: constrainedValue });
  };

  return (
    <div className="bg-[#1E293980] p-[25px] dss-rounded border border-gray-700 space-y-5">
      {/* Power Toggle */}
      <div className="flex items-center justify-between">
        <span className="control-panel-label">Power</span>
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
        <div className="flex items-center justify-between mb-[10px]">
          <span className="control-panel-label">Speed</span>
          <span className="text-(--text-dark-gray) text-base font-normal">
            {speed}%
          </span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          min={VALIDATION.SPEED.MIN}
          max={VALIDATION.SPEED.MAX}
          value={speed}
          onChange={handleSpeedChange}
          disabled={!power}
          className={`w-full ${!power ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-disabled={!power}
        />
      </div>
    </div>
  );
};

export default FanControls;
