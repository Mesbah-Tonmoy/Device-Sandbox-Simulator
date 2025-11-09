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
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 11.6667C12.6667 10.8333 13.0833 10.25 13.75 9.58333C14.5833 8.83333 15 7.75 15 6.66666C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66666 10 1.66666C8.67392 1.66666 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66666C5 7.5 5.16667 8.5 6.25 9.58333C6.83333 10.1667 7.33333 10.8333 7.5 11.6667"
            stroke="#99A1AF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 15H12.5"
            stroke="#99A1AF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.33337 18.3333H11.6667"
            stroke="#99A1AF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_7_505)">
          <path
            d="M9.02249 13.6492C8.14929 14.0904 7.16703 14.2695 6.19428 14.1649C5.22152 14.0602 4.29986 13.6762 3.54053 13.0592C2.7812 12.4423 2.21666 11.6188 1.91505 10.688C1.61345 9.75733 1.58767 8.75921 1.84083 7.81416L6.35082 9.02249C5.90956 8.14929 5.73045 7.16703 5.83513 6.19428C5.93981 5.22152 6.32379 4.29986 6.94074 3.54053C7.55768 2.7812 8.38122 2.21666 9.31194 1.91505C10.2427 1.61345 11.2408 1.58767 12.1858 1.84083L10.9775 6.35082C11.8507 5.90956 12.833 5.73045 13.8057 5.83513C14.7785 5.93981 15.7001 6.32379 16.4595 6.94074C17.2188 7.55768 17.7833 8.38122 18.0849 9.31194C18.3865 10.2427 18.4123 11.2408 18.1592 12.1858L13.6492 10.9775C14.0904 11.8507 14.2695 12.833 14.1649 13.8057C14.0602 14.7785 13.6762 15.7001 13.0592 16.4595C12.4423 17.2188 11.6188 17.7833 10.688 18.0849C9.75733 18.3865 8.75921 18.4123 7.81416 18.1592L9.02249 13.6492Z"
            stroke="#99A1AF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 10V10.0083"
            stroke="#99A1AF"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_7_505">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const getLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg 
        bg-gray-800 
        hover:bg-gray-700 
        border border-gray-700 
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <div className="text-gray-400">{getIcon()}</div>
      <span className="text-[#E5E7EB] text-sm font-normal">{getLabel()}</span>
    </div>
  );
};

export default DeviceItem;
