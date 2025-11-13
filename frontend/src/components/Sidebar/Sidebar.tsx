/**
 * Sidebar Component - Contains device list and saved presets
 */

import React, { useState, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import DeviceItem from './DeviceItem';
import PresetItem from './PresetItem';
import { DEVICE_TYPES } from '../../utils/constants';
import XMark from '../Icons/XMark';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const { presets, loading, currentDevice } = useDevice();
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip only on first load if no device exists
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenDragTooltip');

    // Only show if never seen before, no device, and not loading
    if (!hasSeenTooltip && !currentDevice && !loading) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // Hide tooltip if it was showing
      setShowTooltip(false);
    }
  }, [currentDevice, loading]);

  // Hide tooltip permanently when user adds first device
  useEffect(() => {
    if (currentDevice && showTooltip) {
      setShowTooltip(false);
      localStorage.setItem('hasSeenDragTooltip', 'true');
    }
  }, [currentDevice, showTooltip]);

  if (loading) {
    return (
      <aside className="w-56 bg-dark-primary border-r border-gray-800 p-4 flex items-center justify-center">
        <div className="spinner" />
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0A101D91] backdrop-blur-[11px] z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-56 bg-dark-secondary border-r border-gray-800 p-4 flex flex-col gap-6 overflow-visible md:relative md:translate-x-0 fixed top-0 left-0 bottom-0 z-40 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden self-end cursor-pointer"
          aria-label="Close Sidebar"
        >
          <XMark />
        </button>

        {/* Devices Section */}
        <section className="relative">
          <h2 className="text-(--text-light-primary) text-base font-normal mb-3">
            Devices
          </h2>
          <div className="flex flex-col gap-2">
            <DeviceItem type={DEVICE_TYPES.LIGHT} onSelect={onClose} />
            <DeviceItem type={DEVICE_TYPES.FAN} onSelect={onClose} />
          </div>

          {/* Drag Tooltip - Arrow pointing to devices */}
          {showTooltip && (
            <div
              className={`absolute left-full ml-4 top-4/5 -translate-y-1/2 z-50 ${isMobileOpen ? 'block' : 'hidden md:block'}`}
            >
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#2175D7]"></div>
              </div>

              {/* Tooltip Box */}
              <div className="bg-primary-blue text-white p-3 sm:p-6 rounded-lg shadow-2xl w-[227px] relative">
                <p className="text-(--text-light-primary) text-base">
                  Drag items from here
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Saved Presets Section */}
        <section>
          <h2 className="text-(--text-light-primary) text-base font-normal mb-3">
            Saved Presets
          </h2>
          <div className="flex flex-col gap-2">
            {presets.length === 0 ? (
              <div className="border border-gray-700 rounded-[10px] p-3 h-12">
                <span className="text-(--text-light-secondary) opacity-30 text-base ">
                  Nothing added yet
                </span>
              </div>
            ) : (
              presets.map((preset) => (
                <PresetItem
                  key={preset.id}
                  preset={preset}
                  onSelect={onClose}
                />
              ))
            )}
          </div>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
