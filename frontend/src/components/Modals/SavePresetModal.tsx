/**
 * SavePresetModal Component - Modal for saving presets
 */

import React, { useState, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { ERROR_MESSAGES, VALIDATION } from '../../utils/constants';
import XMark from '../Icons/XMark';

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { saveAsPreset } = useDevice();
  const [presetName, setPresetName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPresetName('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!presetName.trim()) {
      setError(ERROR_MESSAGES.PRESET_NAME_REQUIRED);
      return;
    }

    if (presetName.length > VALIDATION.PRESET_NAME.MAX_LENGTH) {
      setError(ERROR_MESSAGES.PRESET_NAME_TOO_LONG);
      return;
    }

    setIsLoading(true);

    try {
      await saveAsPreset(presetName.trim());
      onClose();
    } catch (err: any) {
      // Handle API error message
      const errorMessage =
        err?.message ||
        err?.error ||
        'Failed to save preset. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative bg-dark-secondary rounded-xl border border-gray-700 w-full max-w-[530px] mx-4 shadow-2xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 className="text-(--text-light-secondary) text-lg font-bold">
          Give me a name
        </h2>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="text-gray-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          <XMark />
        </button>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="p-6">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          name="preset-name"
          placeholder="Name it"
          disabled={isLoading}
          className="w-full px-3 py-3 bg-gray-700 rounded-lg text-white text-sm placeholder-(--text-dark-gray) focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          autoFocus
        />

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        <p className="mt-[14px] text-(--text-dark-gray) text-sm">
          By adding this effect as a present you can reuse this anytime.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-12">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-(--text-light-gray) rounded-lg border border-gray-700 transition-all duration-200 font-normal disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-normal disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isLoading && <div className="spinner w-4 h-4 border-2" />}
            Save Preset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SavePresetModal;
