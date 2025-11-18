/**
 * PresetItem Component - Draggable preset in sidebar
 */

import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useDevice } from '../../context/DeviceContext';
import type { Preset } from '../../types';
import { DND_TYPES } from '../../utils/constants';
import Light from '../Icons/Light';
import Fan from '../Icons/Fan';
import Trash from '../Icons/Trash';

interface PresetItemProps {
  preset: Preset;
  onSelect?: () => void;
}

const PresetItem: React.FC<PresetItemProps> = ({ preset, onSelect }) => {
  const { isModalOpen, deletePreset } = useDevice();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPES.PRESET,
      item: { type: DND_TYPES.PRESET, preset },
      canDrag: !isModalOpen, // Disable dragging when modal is open
      end: (_, monitor) => {
        // Close mobile sidebar after successful drop
        if (monitor.didDrop() && onSelect) {
          onSelect();
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [preset, isModalOpen]
  ); // Add isModalOpen to dependencies

  // Close sidebar when dragging starts
  useEffect(() => {
    if (isDragging && onSelect) {
      onSelect();
    }
  }, [isDragging, onSelect]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${preset.name}"?`
    );

    if (confirmed) {
      deletePreset(preset.id);
    }
  };

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 p-3 rounded-lg 
        bg-gray-800 
        border border-gray-700 
        h-[46px]
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${
          isModalOpen
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-700 cursor-grab active:cursor-grabbing group'
        }
      `}
    >
      {preset.device_type === 'light' ? <Light /> : <Fan />}
      <span className="text-white text-sm truncate flex-1">{preset.name}</span>

      {/* Delete button - shown on hover (desktop) or tap (mobile) */}
      <button
        onClick={handleDelete}
        className={`
          p-2 rounded-md 
          text-red-400 hover:text-red-300 hover:bg-red-500/10
          transition-all duration-200 cursor-pointer
          md:invisible md:opacity-0 md:group-hover:opacity-100 md:group-hover:visible
        `}
        aria-label="Delete preset"
        title="Delete preset"
      >
        <Trash />
      </button>
    </div>
  );
};

export default PresetItem;
