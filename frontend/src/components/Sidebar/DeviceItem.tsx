/**
 * DeviceItem Component - Draggable device in sidebar
 */

import React from 'react';
import { useDrag } from 'react-dnd';
import { useDevice } from '../../context/DeviceContext';
import type { DeviceType } from '../../types';
import { DND_TYPES } from '../../utils/constants';
import Light from '../Icons/Light';
import Fan from '../Icons/Fan';

interface DeviceItemProps {
  type: DeviceType;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ type }) => {
  const { currentDevice } = useDevice();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_TYPES.DEVICE,
    item: { type: DND_TYPES.DEVICE, deviceType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Check if this device type is currently on canvas
  const isSelected = currentDevice !== null && currentDevice.type === type;

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 p-3 rounded-lg 
        ${isSelected ? 'bg-[#646F7F]' : 'bg-gray-800'}
        hover:bg-gray-700 
        border border-gray-700 
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {type === 'light' ? <Light /> : <Fan />}
      <span className="text-(--text-light-secondary) text-sm font-normal">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
      {/* Debug indicator */}
      {/* {isSelected && <span className="ml-auto text-xs text-blue-400">●</span>} */}
    </div>
  );
};

export default DeviceItem;
