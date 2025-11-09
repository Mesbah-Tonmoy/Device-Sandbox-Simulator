/**
 * Sidebar Component - Contains device list and saved presets
 */

import React from 'react';
import { useDevice } from '../../context/DeviceContext';
import DeviceItem from './DeviceItem';
import PresetItem from './PresetItem';
import { DEVICE_TYPES } from '../../utils/constants';

const Sidebar: React.FC = () => {
  const { presets, loading } = useDevice();

  if (loading) {
    return (
      <aside className="w-56 bg-[var(--color-dark-primary)] border-r border-gray-700 p-4 flex items-center justify-center">
        <div className="spinner" />
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-[var(--color-dark-primary)] border-r border-gray-700 p-4 flex flex-col gap-6 overflow-y-auto">
      {/* Devices Section */}
      <section>
        <h2 className="text-white text-base font-medium mb-3">Devices</h2>
        <div className="flex flex-col gap-2">
          <DeviceItem type={DEVICE_TYPES.LIGHT} />
          <DeviceItem type={DEVICE_TYPES.FAN} />
        </div>
      </section>

      {/* Saved Presets Section */}
      <section>
        <h2 className="text-white text-base font-medium mb-3">Saved Presets</h2>
        <div className="flex flex-col gap-2">
          {presets.length === 0 ? (
            <div className="text-gray-500 text-sm italic py-2">Nothing added yet</div>
          ) : (
            presets.map((preset) => <PresetItem key={preset.id} preset={preset} />)
          )}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;