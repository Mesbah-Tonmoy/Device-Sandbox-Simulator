/**
 * DeviceInstance Component - Displays device on canvas with controls
 */

import React from 'react';
import type { Device, LightSettings, FanSettings } from '../../types';
import LightDevice from '../Devices/LightDevice';
import FanDevice from '../Devices/FanDevice';
import LightControls from '../Controls/LightControls';
import FanControls from '../Controls/FanControls';

interface DeviceInstanceProps {
  device: Device;
}

const DeviceInstance: React.FC<DeviceInstanceProps> = ({ device }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#10182880] border-2 border-[#1E2939] rounded-[14px]">
      {/* Device Visual */}
      <div className="mb-30 mt-35">
        {device.type === 'light' ? (
          <LightDevice settings={device.settings as LightSettings} />
        ) : (
          <FanDevice settings={device.settings as FanSettings} />
        )}
      </div>

      {/* Control Panel */}
      <div className="control-panel mb-6">
        {device.type === 'light' ? <LightControls /> : <FanControls />}
      </div>
    </div>
  );
};

export default DeviceInstance;
