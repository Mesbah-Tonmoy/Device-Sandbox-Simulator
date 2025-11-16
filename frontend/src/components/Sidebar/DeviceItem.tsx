/**
 * DeviceItem Component - Draggable device in sidebar
 */

import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useDevice } from '../../context/DeviceContext';
import type { DeviceType } from '../../types';
import { DND_TYPES } from '../../utils/constants';
import Light from '../Icons/Light';
import Fan from '../Icons/Fan';

interface DeviceItemProps {
  type: DeviceType;
  onSelect?: () => void;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ type, onSelect }) => {
  const { currentDevice, isModalOpen } = useDevice();

  const [{ isDragging }, drag] = useDrag(
    {
      type: DND_TYPES.DEVICE,
      item: { type: DND_TYPES.DEVICE, deviceType: type },
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
    },
    [isModalOpen]
  ); // Add isModalOpen to dependencies

  // Close sidebar when dragging starts
  useEffect(() => {
    if (isDragging && onSelect) {
      onSelect();
    }
  }, [isDragging, onSelect]);

  // Check if this device type is currently on canvas
  const isSelected = currentDevice !== null && currentDevice.type === type;

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 p-3 rounded-lg 
        ${isSelected ? 'bg-[#646F7F]' : 'bg-gray-800'}
        border border-gray-700 
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${
          isModalOpen
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-700 cursor-grab active:cursor-grabbing'
        }
      `}
    >
      {type === 'light' ? <Light /> : <Fan />}
      <span className="text-(--text-light-secondary) text-sm font-normal">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </div>
  );
};

export default DeviceItem;
