// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with react-toastify usage in active pages
// @owner Bhavini
// @feature Notification display utilities
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const types = {
    success: {
      bg: 'bg-gradient-to-br from-[#26de81] to-[#20bf6b]',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'text-white',
      shadow: 'shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.04),0_0_20px_rgba(38,222,129,0.3)]'
    },
    error: {
      bg: 'bg-gradient-to-br from-[#fc5c65] to-[#eb3b5a]',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'text-white',
      shadow: 'shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.04),0_0_20px_rgba(252,92,101,0.3)]'
    },
    warning: {
      bg: 'bg-gradient-to-br from-[#fed330] to-[#f7b731]',
      icon: (
        <svg className="w-5 h-5 text-[#1e272e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      text: 'text-[#1e272e]',
      shadow: 'shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.04),0_0_20px_rgba(254,211,48,0.3)]'
    },
    info: {
      bg: 'bg-gradient-to-br from-[#45aaf2] to-[#4b7bec]',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'text-white',
      shadow: 'shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.04),0_0_20px_rgba(69,170,242,0.3)]'
    }
  };
  
  const config = types[type];
  
  return (
    <div className={`flex items-center gap-3 p-4 rounded-[20px] ${config.bg} ${config.shadow} animate-in slide-in-from-right duration-300`}>
      {config.icon}
      <p className={`flex-1 font-semibold ${config.text}`}>{message}</p>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
