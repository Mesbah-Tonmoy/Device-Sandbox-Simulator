/**
 * Canvas Component - Main droppable area
 */

import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDevice } from '../../context/DeviceContext';
import DeviceInstance from './DeviceInstance';
import SavePresetModal from '../Modals/SavePresetModal';
import Notification from '../Notification/Notification';
import { DND_TYPES } from '../../utils/constants';
import type { DragItem } from '../../types';
import Bars from '../Icons/Bars';
import Ellipsis from '../Icons/Ellipsis';

interface CanvasProps {
  onToggleSidebar?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ onToggleSidebar }) => {
  const { currentDevice, addDevice, loadPreset, removeDevice } = useDevice();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [DND_TYPES.DEVICE, DND_TYPES.PRESET],
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // Calculate position relative to canvas
      const canvasRect = document
        .getElementById('canvas')
        ?.getBoundingClientRect();
      if (!canvasRect) return;

      const position = {
        x: Math.round(offset.x - canvasRect.left),
        y: Math.round(offset.y - canvasRect.top),
      };

      if (item.type === DND_TYPES.DEVICE && item.deviceType) {
        addDevice(item.deviceType, position);
      } else if (item.type === DND_TYPES.PRESET && item.preset) {
        loadPreset(item.preset);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleClear = () => {
    removeDevice();
    setIsMobileMenuOpen(false);
  };

  const handleSavePreset = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Header with buttons */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 relative">
        {/* Left side - Toggle + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden bg-dark-secondary p-2 rounded-lg border border-gray-700 text-white hover:text-gray-200 transition-all cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Bars />
          </button>

          <h1 className="text-(--text-light-primary) text-sm sm:text-base font-normal">
            Testing Canvas
          </h1>
        </div>

        {/* Right side - Desktop buttons / Mobile menu */}
        {currentDevice && (
          <>
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-3">
              <button
                onClick={handleClear}
                disabled={isModalOpen}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-sm sm:text-base text-(--text-light-gray) rounded-lg border border-gray-700 transition-all duration-200 font-normal disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={handleSavePreset}
                disabled={isModalOpen}
                className="px-3 py-2 bg-primary-blue hover:bg-blue-600 text-sm sm:text-base text-white rounded-lg transition-all duration-200 font-normal disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Save Preset
              </button>
            </div>

            {/* Mobile 3-dot Menu */}
            <div className="md:hidden relative">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-gray-300 transition-colors p-2 cursor-pointer"
                aria-label="Menu"
              >
                <Ellipsis />
              </button>

              {/* Dropdown Menu */}
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl z-20 overflow-hidden">
                    <button
                      onClick={handleClear}
                      className="w-full text-left px-4 py-3 text-(--text-light-gray) hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSavePreset}
                      className="w-full text-left px-4 py-3 text-(--text-light-gray) hover:bg-gray-700 transition-colors border-t border-gray-700 cursor-pointer"
                    >
                      Save Preset
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </header>

      {/* Canvas Area - Relative positioning for notification and modal */}
      <div
        id="canvas"
        ref={drop as any}
        className={`flex-1 relative ${isModalOpen ? 'overflow-hidden' : 'overflow-auto'} bg-dark-primary transition-colors duration-200 px-6 pb-6 ${isOver ? 'bg-dark-secondary' : ''}`}
      >
        {/* Notification - Inside Canvas */}
        <Notification />

        {/* Empty State */}
        {!currentDevice && (
          <div className="flex items-center justify-center bg-[#10182880] border-2 border-gray-800 dss-rounded min-h-full">
            <p className="text-(--text-light-secondary) text-base opacity-30">
              {isOver ? 'Drop here' : 'Drag anything here'}
            </p>
          </div>
        )}

        {/* Device Instance */}
        {currentDevice && <DeviceInstance device={currentDevice} />}

        {/* Modal Overlay - Only covers canvas */}
        {isModalOpen && (
          <div className="absolute inset-0 z-40 h-screen flex items-center justify-center">
            {/* Backdrop - Only canvas area */}
            <div
              className="absolute inset-0 bg-[#0A101DE5] backdrop-blur-[11px]"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <SavePresetModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
