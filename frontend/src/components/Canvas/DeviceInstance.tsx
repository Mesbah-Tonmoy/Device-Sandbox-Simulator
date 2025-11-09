/**
 * DeviceInstance Component - Displays device on canvas with controls
 */

import React from 'react';
import type { Device } from '../../types';
import LightDevice from '../Devices/LightDevice';
import FanDevice from '../Devices/FanDevice';
import LightControls from '../Controls/LightControls';
import FanControls from '../Controls/FanControls';

interface DeviceInstanceProps {
  device: Device;
}

const DeviceInstance: React.FC<DeviceInstanceProps> = ({ device }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Device Visual */}
      <div className="mb-8">
        {device.type === 'light' ? (
          <LightDevice settings={device.settings} />
        ) : (
          <FanDevice settings={device.settings} />
        )}
      </div>

      {/* Control Panel */}
      <div className="control-panel w-[440px]">
        {device.type === 'light' ? <LightControls /> : <FanControls />}
      </div>
    </div>
  );
};

export default DeviceInstance;