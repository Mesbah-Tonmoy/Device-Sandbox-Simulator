/**
 * PresetItem Component - Draggable preset in sidebar
 */

import React from 'react';
import { useDrag } from 'react-dnd';
import type { Preset } from '../../types';
import { DND_TYPES } from '../../utils/constants';
import Light from '../Icons/Light';
import Fan from '../Icons/Fan';

interface PresetItemProps {
  preset: Preset;
}

const PresetItem: React.FC<PresetItemProps> = ({ preset }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_TYPES.PRESET,
    item: { type: DND_TYPES.PRESET, preset },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center gap-3 p-3 rounded-lg 
        bg-gray-800 
        hover:bg-gray-700 
        border border-gray-700 
        h-[46px]
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {preset.device_type === 'light' ? <Light /> : <Fan />}
      <span className="text-white text-sm truncate flex-1">{preset.name}</span>
    </div>
  );
};

export default PresetItem;
