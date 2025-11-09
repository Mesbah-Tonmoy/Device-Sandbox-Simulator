/**
 * DeviceItem Component - Draggable device in sidebar
 */

import React from 'react';
import { useDrag } from 'react-dnd';
import type { DeviceType } from '../../types';
import { DND_TYPES } from '../../utils/constants';

interface DeviceItemProps {
  type: DeviceType;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_TYPES.DEVICE,
    item: { type: DND_TYPES.DEVICE, deviceType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getIcon = () => {
    if (type === 'light') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  const getLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg 
        bg-[var(--color-dark-secondary)] 
        hover:bg-[var(--color-dark-tertiary)] 
        border border-gray-700 
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <div className="text-gray-400">{getIcon()}</div>
      <span className="text-white text-sm font-medium">{getLabel()}</span>
    </div>
  );
};

export default DeviceItem;