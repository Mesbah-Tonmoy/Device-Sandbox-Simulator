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
    <div className="bg-[var(--color-dark-secondary)] p-6 rounded-xl border border-gray-700 space-y-5">
      {/* Power Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-white text-sm font-medium">Power</label>
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
        <label className="text-white text-sm font-medium block mb-3">
          Color Temperature
        </label>
        <div className="flex gap-2">
          {Object.entries(COLOR_TEMP_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleColorTempChange(key as ColorTemp)}
              className={`
                color-temp-option ${config.bgClass}
                ${colorTemp === key ? 'selected' : ''}
              `}
              aria-label={config.label}
            />
          ))}
        </div>
      </div>

      {/* Brightness Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white text-sm font-medium">Brightness</label>
          <span className="text-gray-400 text-sm font-medium">{brightness}%</span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LightControls;