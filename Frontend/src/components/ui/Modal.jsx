import React, { useEffect } from 'react';
import Card from './Card';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  closeOnOverlay = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      
      <div className={`relative w-full ${sizes[size]} animate-in fade-in zoom-in duration-200`}>
        <div className="bg-[#252d32] rounded-[28px] shadow-[20px_20px_40px_rgba(0,0,0,0.8),-20px_-20px_40px_rgba(255,255,255,0.05)]">
          {title && (
            <div className="flex items-center justify-between p-8 border-b border-[#2d3436]">
              <h3 className="text-xl font-bold text-[#e1e8ed]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-[#747d8c] hover:text-[#e1e8ed] rounded-full transition-all
                  bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-sm)]
                  hover:shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.03)]
                  active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.02)]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="p-8">
            {children}
          </div>
          
          {footer && (
            <div className="p-8 border-t border-[#2d3436]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
