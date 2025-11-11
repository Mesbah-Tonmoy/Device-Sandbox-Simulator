/**
 * LightControls Component - Control panel for light device
 */

import React, { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import type { LightSettings, ColorTemp } from '../../types';
import { COLOR_TEMP_CONFIG } from '../../utils/constants';

const LightControls: React.FC = () => {
  const { currentDevice, updateDevice } = useDevice();
  const sliderRef = useRef<HTMLInputElement>(null);

  if (!currentDevice || currentDevice.type !== 'light') return null;

  const settings = currentDevice.settings as LightSettings;
  const { power, brightness, colorTemp } = settings;

  // Update slider gradient
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--value', `${brightness}%`);
    }
  }, [brightness]);

  const handlePowerToggle = () => {
    updateDevice({ power: !power });
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseInt(e.target.value);
    updateDevice({ brightness: newBrightness });
  };

  const handleColorTempChange = (newColorTemp: ColorTemp) => {
    updateDevice({ colorTemp: newColorTemp });
  };

  return (
    <div className="bg-[#1E293980] p-[25px] dss-rounded border border-gray-700 space-y-5">
      {/* Power Toggle */}
      <div className="flex items-center justify-between">
        <label>Power</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="light-power"
            checked={power}
            onChange={handlePowerToggle}
          />
          <label htmlFor="light-power" />
        </div>
      </div>

      {/* Color Temperature */}
      <div>
        <label className="block mb-[10px]">Color Temperature</label>
        <div className="flex gap-2">
          {Object.entries(COLOR_TEMP_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleColorTempChange(key as ColorTemp)}
              className={`
                color-temp-option w-[93.5px] h-12 rounded-xl border-2 border-gray-600 transition-all duration-200 ${config.bgClass}
                ${colorTemp === key ? 'selected' : ''}
                ${!power ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-label={config.label}
              disabled={!power}
            />
          ))}
        </div>
      </div>

      {/* Brightness Slider */}
      <div>
        <div className="flex items-center justify-between mb-[10px]">
          <label>Brightness</label>
          <span className="text-(--text-dark-gray) text-base font-normal">
            {brightness}%
          </span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
          disabled={!power}
          className={`w-full ${!power ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-disabled={!power}
        />
      </div>
    </div>
  );
};

export default LightControls;
