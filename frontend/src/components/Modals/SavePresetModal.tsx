/**
 * SavePresetModal Component - Modal for saving presets
 */

import React, { useState, useEffect } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { ERROR_MESSAGES, VALIDATION } from '../../utils/constants';

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
    } catch (err) {
      setError('Failed to save preset. Please try again.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-dark-secondary rounded-xl border border-gray-700 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-lg font-bold">Give me a name</h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Name it"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-dark-tertiary border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            autoFocus
          />

          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

          <p className="mt-3 text-gray-400 text-sm">
            By adding this effect as a preset you can reuse this anytime.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-5 py-2 bg-dark-tertiary hover:bg-dark-hover text-white rounded-lg border border-gray-600 transition-all duration-200 font-normal disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg transition-all duration-200 font-normal disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <div className="spinner w-4 h-4 border-2" />}
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavePresetModal;
