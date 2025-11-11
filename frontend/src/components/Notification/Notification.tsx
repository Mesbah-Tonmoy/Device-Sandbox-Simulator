import React, { type JSX } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const Notification: React.FC = () => {
  const { notification } = useDevice();

  if (!notification) return null;

  const { message, type } = notification;

  const getIcon = (): JSX.Element => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="16" fill="#303746" />
            <mask
              id="mask0_16_367"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="4"
              y="4"
              width="24"
              height="24"
            >
              <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_16_367)">
              <path
                d="M14.6 20.6L21.65 13.55L20.25 12.15L14.6 17.8L11.75 14.95L10.35 16.35L14.6 20.6ZM16 26C14.6167 26 13.3167 25.7373 12.1 25.212C10.8833 24.6873 9.825 23.975 8.925 23.075C8.025 22.175 7.31267 21.1167 6.788 19.9C6.26267 18.6833 6 17.3833 6 16C6 14.6167 6.26267 13.3167 6.788 12.1C7.31267 10.8833 8.025 9.825 8.925 8.925C9.825 8.025 10.8833 7.31233 12.1 6.787C13.3167 6.26233 14.6167 6 16 6C17.3833 6 18.6833 6.26233 19.9 6.787C21.1167 7.31233 22.175 8.025 23.075 8.925C23.975 9.825 24.6873 10.8833 25.212 12.1C25.7373 13.3167 26 14.6167 26 16C26 17.3833 25.7373 18.6833 25.212 19.9C24.6873 21.1167 23.975 22.175 23.075 23.075C22.175 23.975 21.1167 24.6873 19.9 25.212C18.6833 25.7373 17.3833 26 16 26Z"
                fill="#00DF80"
              />
            </g>
          </svg>
        );
      case NOTIFICATION_TYPES.ERROR:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NOTIFICATION_TYPES.WARNING:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getColorClasses = (): string => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-[#242C32] text-white';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-600 text-white';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 notification">
      <div
        className={`relative flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl ${getColorClasses()}`}
      >
        <div className="absolute w-[212px] h-[212px] top-1/2 left-0 -translate-x-[30%] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,237,81,0.12)_0%,rgba(0,237,123,0)_100%)]" />
        <div className="shrink-0">{getIcon()}</div>
        <p className="font-semibold text-[17px]">{message}</p>
      </div>
    </div>
  );
};

export default Notification;
