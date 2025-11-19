/**
 * DeviceInstance Component - Displays device on canvas with controls
 */

import React from 'react';
import type { Device, LightSettings, FanSettings } from '../../types';
import { useDevice } from '../../context/DeviceContext';
import LightDevice from '../Devices/LightDevice';
import FanDevice from '../Devices/FanDevice';
import LightControls from '../Controls/LightControls';
import FanControls from '../Controls/FanControls';

interface DeviceInstanceProps {
  device: Device;
}

const DeviceInstance: React.FC<DeviceInstanceProps> = ({ device }) => {
  const { isModalOpen } = useDevice();

  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#10182880] border-2 border-gray-800 dss-rounded px-4 ${isModalOpen ? 'h-screen overflow-hidden' : ''}`}
    >
      {/* Device Visual */}
      <div className="lg:my-18 my-15">
        {device.type === 'light' ? (
          <LightDevice settings={device.settings as LightSettings} />
        ) : (
          <FanDevice settings={device.settings as FanSettings} />
        )}
      </div>

      {/* Control Panel */}
      <div className="control-panel max-w-[448px] w-full lg:mb-6 mb-4">
        {device.type === 'light' ? <LightControls /> : <FanControls />}
      </div>
    </div>
  );
};

export default DeviceInstance;
