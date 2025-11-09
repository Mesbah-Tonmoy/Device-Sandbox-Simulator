/**
 * Canvas Component - Main droppable area
 */

import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDevice } from '../../context/DeviceContext';
import DeviceInstance from './DeviceInstance';
import SavePresetModal from '../Modals/SavePresetModal';
import { DND_TYPES } from '../../utils/constants';
import type { DragItem } from '../../types';

const Canvas: React.FC = () => {
  const { currentDevice, addDevice, loadPreset, removeDevice } = useDevice();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [DND_TYPES.DEVICE, DND_TYPES.PRESET],
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // Calculate position relative to canvas
      const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
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
  };

  const handleSavePreset = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Header with buttons */}
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--color-dark-primary)] border-b border-gray-700">
        <h1 className="text-white text-lg font-medium">Testing Canvas</h1>
        {currentDevice && (
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-[var(--color-dark-tertiary)] hover:bg-[var(--color-dark-hover)] text-white rounded-lg border border-gray-600 transition-all duration-200 font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Save Preset
            </button>
          </div>
        )}
      </header>

      {/* Canvas Area */}
      <div
        id="canvas"
        ref={drop}
        className={`
          flex-1 relative overflow-hidden
          bg-[var(--color-dark-primary)]
          transition-colors duration-200
          ${isOver ? 'bg-[var(--color-dark-secondary)]' : ''}
        `}
      >
        {/* Empty State */}
        {!currentDevice && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600 text-base">
              {isOver ? 'Drop here' : 'Drag anything here'}
            </p>
          </div>
        )}

        {/* Device Instance */}
        {currentDevice && <DeviceInstance device={currentDevice} />}
      </div>

      {/* Save Preset Modal */}
      <SavePresetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Canvas;